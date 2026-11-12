const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const { spawnSync } = require('node:child_process');

function load(path, overrides = {}) {
  const source = fs.readFileSync(path, 'utf8');
  const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const module = { exports: {} };
  vm.runInNewContext(js, { module, exports: module.exports, Buffer, require: name => overrides[name] || require(name) });
  return module.exports;
}
const { parseErpInventoryQuery, normalizeInventoryWarehouseCode, parseInventoryWarehouseScope } = load('src/domain/dto/products/erp-inventory-query.dto.ts');
const { buildInventoryQueries, ProscaiInventoryDatasource } = load('src/infrastructure/datasource/proscai-inventory.datasource.ts', {
  '../database/proscai.mysql-connection': { pool: { query: async () => { throw new Error('Unexpected database call'); } } },
});

test('inventory validates filters, pagination and ordering before SQL', () => {
  const query = parseErpInventoryQuery({});
  assert.equal(query.page, 1); assert.equal(query.pageSize, 25); assert.equal(query.query, '');
  assert.equal(parseErpInventoryQuery({ warehouseCode: '6' }).warehouseCode, '06');
  for (const bad of [{ query: ['TSC'] }, { query: 'x'.repeat(161) }, { page: '-1' }, { page: '1.5' }, { page: '0' },
    { page: '9007199254740991' }, { pageSize: '999' }, { stock: 'unknown' }, { sortBy: 'ICOD; DROP' },
    { sortDirection: 'asc; DROP' }, { warehouseCode: '01 OR 1=1' }]) assert.throws(() => parseErpInventoryQuery(bad));
});

test('query parameters stay bound and wildcard characters are literal', () => {
  const { rowsSql, countSql, params, rowsParams } = buildInventoryQueries(parseErpInventoryQuery({ query: "TSC%'_!", warehouseCode: '06', page: '2', stock: 'negative', sortBy: 'stock', sortDirection: 'desc' }));
  assert.deepEqual(Array.from(params), ["%TSC!%'!_!!%", "%TSC!%'!_!!%", "%TSC!%'!_!!%", '06']);
  assert.deepEqual(Array.from(rowsParams).slice(-2), [25, 25]);
  assert.match(rowsSql, /ORDER BY stock DESC/); assert.match(rowsSql, /stock < 0/);
  assert.doesNotMatch(rowsSql, /ILISTA|ICODSAT|ICTA|ITIPO|INSERT|DELETE|UPDATE/);
  assert.doesNotMatch(countSql, /TSC/);
  for (const sql of [rowsSql, countSql]) for (const column of ['ean', 'code', 'description']) {
    assert.ok(sql.includes(`UPPER(CONVERT(${column} USING utf8mb4)) LIKE UPPER(CONVERT(? USING utf8mb4))`));
  }
});

test('inventory normalizes search case and NFC without changing warehouse text identifiers', () => {
  assert.equal(parseErpInventoryQuery({ query: '  tSc  ' }).query, 'TSC');
  assert.equal(parseErpInventoryQuery({ query: ' va\u0301lvula ' }).query, 'VÁLVULA');
  for (const [input, expected] of [['1', '01'], ['01', '01'], ['003', '003'], [' ANOID ', 'ANOID'], ['|', '|'], ['0|', '0|'], ['ABCDEF', 'ABCDEF']]) {
    assert.equal(normalizeInventoryWarehouseCode(input), expected);
    assert.equal(parseErpInventoryQuery({ warehouseCode: input }).warehouseCode, expected);
  }
  for (const input of ['', ' ', null, 6, 'TOOLONG', '\t01', '01\n', 'A\u0000', '\u0085A']) {
    assert.throws(() => normalizeInventoryWarehouseCode(input));
  }
});

const pythonAvailable = spawnSync('python3', ['--version']).status === 0;
function fixtureQuery(query, warehouseCodes) {
  const sql = buildInventoryQueries(parseErpInventoryQuery(query), warehouseCodes);
  // Execute the generated SELECT against an isolated relational fixture, never Proscai.
  const script = `import json, sqlite3, sys, re
x=json.load(sys.stdin)
# Translate MySQL's character conversion syntax, retaining Unicode-aware uppercase.
for key in ('countSql','rowsSql'):
 x[key]=re.sub(r'CONVERT\\((ean|code|description|ALMNUM|\\?) USING utf8mb4\\)',r'CAST(\\1 AS TEXT)',x[key]).replace('COLLATE utf8mb4_bin','COLLATE BINARY')
c=sqlite3.connect(':memory:'); c.row_factory=sqlite3.Row
c.create_function('GREATEST', -1, max)
c.create_function('CHAR_LENGTH', 1, lambda s: len(s) if s is not None else None)
c.create_function('LPAD', 3, lambda s,n,p: str(s).rjust(n,p) if s is not None else None)
c.create_function('REGEXP', 2, lambda pattern,s: re.search(pattern,s or '') is not None)
c.create_function('UPPER', 1, lambda s: s.upper() if s is not None else None)
c.executescript('''CREATE TABLE FINV(ISEQ INTEGER, ICOD TEXT, IEAN TEXT, IUM TEXT, IDESCR TEXT);
CREATE TABLE FALM(ISEQ INTEGER, ALMNUM TEXT, ALMCANT REAL);
CREATE TABLE FINV2(I2KEY INTEGER, I2SEQ INTEGER, I2DESCR TEXT);
INSERT INTO FINV VALUES(1,'010001','TSC40','M','Corta'),(2,'020001','TSC40','M','Monterrey'),(3,'030001','OTRO','PZ','Cero'),(4,'040001','','PZ','Sin registro'),(5,'050001','NEG','M','Negativo'),(6,'060001','VC','PZ','Respaldo');
INSERT INTO FALM VALUES(1,'01',3),(1,'01',4),(1,'02',5),(2,'03',8),(3,'01',0),(5,'99',-2),(6,'6',2);
INSERT INTO FINV VALUES(7,'070001','OTR7','M','Texto'),(8,'080001','OTR8','M','Especial'),(9,'090001','OTR9','PZ','VÁLVULA DE ACERO');
INSERT INTO FALM VALUES(7,'ANOID',1),(8,'|',1.5),(9,'003',3);
INSERT INTO FINV2 VALUES(1,20,'Segunda descripcion'),(1,10,'Tubo extendido'),(6,1,' '),(6,2,'Valvula extendida');''')
total=c.execute(x['countSql'],x['params']).fetchone()[0]
rows=[dict(r) for r in c.execute(x['rowsSql'],x['rowsParams'])]
print(json.dumps({'total':total,'rows':rows}))`;
  const result = spawnSync('python3', ['-c', script], { input: JSON.stringify(sql), encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  return JSON.parse(result.stdout);
}

test('stock is grouped before descriptions; equal EANs across ERP codes remain separate', { skip: !pythonAvailable }, () => {
  const result = fixtureQuery({ query: 'TSC' });
  assert.equal(result.total, 3);
  assert.deepEqual(result.rows.map(row => [row.code, row.warehouseCode, row.stock]), [
    ['010001', '01', 7], ['010001', '02', 5], ['020001', '03', 8],
  ]);
  assert.equal(result.rows[0].description, 'Tubo extendido');
  assert.equal(fixtureQuery({ query: 'Valvula extendida' }).rows[0].warehouseCode, '06');
});
test('zero, negative, no-warehouse, fallback descriptions and missing EAN are preserved', { skip: !pythonAvailable }, () => {
  assert.equal(fixtureQuery({ stock: 'zero' }).rows[0].stock, 0);
  assert.equal(fixtureQuery({ stock: 'negative' }).rows[0].stock, -2);
  const missing = fixtureQuery({ query: 'Sin registro' }).rows[0];
  assert.equal(missing.stock, null); assert.equal(missing.warehouseCode, null); assert.equal(missing.ean, '');
  assert.equal(fixtureQuery({ warehouseCode: '06' }).rows.length, 1);
  assert.equal(fixtureQuery({ page: '2', pageSize: '10' }).rows.length, 0);
  const descending = fixtureQuery({ sortBy: 'stock', sortDirection: 'desc' });
  assert.equal(descending.rows[0].stock, 8);
});
test('case-insensitive SQL and text warehouse filters preserve totals and identities', { skip: !pythonAvailable }, () => {
  const expected = fixtureQuery({ query: 'TSC' });
  assert.deepEqual(fixtureQuery({ query: 'tsc' }), expected);
  assert.deepEqual(fixtureQuery({ query: ' TsC ' }), expected);
  assert.equal(fixtureQuery({ query: ' va\u0301lvula ' }).rows[0].code, '090001');
  assert.equal(fixtureQuery({ query: 'VÁLVULA' }).total, 1);
  for (const code of ['ANOID', '|', '003']) {
    const result = fixtureQuery({ warehouseCode: code });
    assert.equal(result.total, 1);
    assert.equal(result.rows[0].warehouseCode, code);
  }
  assert.equal(fixtureQuery({ warehouseCode: '0|' }).total, 0);
});
test('restricted inventory scopes both rows and totals before pagination', { skip: !pythonAvailable }, () => {
  const result = fixtureQuery({ pageSize: '10' }, ['01', '|']);
  assert.equal(result.total, 3);
  assert.deepEqual(result.rows.map(row => [row.warehouseCode, row.stock]), [['01', 7], ['01', 0], ['|', 1.5]]);
  assert.equal(fixtureQuery({ pageSize: '10', page: '2' }, ['01', '|']).total, 3);
  assert.deepEqual(fixtureQuery({ pageSize: '10', page: '2' }, ['01', '|']).rows, []);
  assert.equal(fixtureQuery({ warehouseCode: '02' }, ['01', '|']).total, 0);
  assert.equal(fixtureQuery({ warehouseCode: '|' }, ['01', '|']).total, 1);
  assert.equal(fixtureQuery({}, ['anoId']).total, 0);
  assert.equal(fixtureQuery({}, []).total, 0);
});
test('internal scope parses repeatable codes and uses bound placeholders', () => {
  assert.equal(parseInventoryWarehouseScope(undefined), undefined);
  assert.deepEqual(Array.from(parseInventoryWarehouseScope('1')), ['01']);
  const scope = parseInventoryWarehouseScope(['ANOID', '1', '01', '|']);
  assert.deepEqual(Array.from(scope), ['01', 'ANOID', '|']);
  for (const value of [null, [], ['\n01'], { code: '01' }, Array(129).fill('01')]) {
    assert.throws(() => parseInventoryWarehouseScope(value));
  }
  const sql = buildInventoryQueries(parseErpInventoryQuery({}), scope);
  for (const statement of [sql.countSql, sql.rowsSql]) {
    assert.match(statement, /warehouseCode IN \(\?, \?, \?\)/);
    assert.doesNotMatch(statement, /ANOID/);
  }
  assert.deepEqual(Array.from(sql.params), ['01', 'ANOID', '|']);
});
test('datasource maps only the approved fields and preserves null instead of inventing zero', async () => {
  let calls = 0;
  const { ProscaiInventoryDatasource: Source } = load('src/infrastructure/datasource/proscai-inventory.datasource.ts', {
    '../database/proscai.mysql-connection': { pool: { query: async () => [calls++ === 0 ? [{ total: 1 }] : [
      { productId: 10, code: '06401952', ean: '', description: 'Material', unit: 'PZ', warehouseCode: null, stock: null, ILISTA4: 999, ICTA: 'private' },
    ]] } },
  });
  const result = await new Source().list(parseErpInventoryQuery({}));
  assert.equal(result.items[0].stock, null); assert.equal(result.items[0].code, '06401952');
  assert.equal('ICTA' in result.items[0], false); assert.equal('ILISTA4' in result.items[0], false);
});
test('ERP confirms the scope it applied even when a page has no results', async () => {
  const calls = [];
  const { ProscaiInventoryDatasource: Source } = load('src/infrastructure/datasource/proscai-inventory.datasource.ts', {
    '../database/proscai.mysql-connection': { pool: { query: async (sql, params) => {
      calls.push({ sql, params: Array.from(params) });
      return [sql.startsWith('SELECT COUNT') ? [{ total: 0 }] : []];
    } } },
  });
  const result = await new Source().list(parseErpInventoryQuery({}), ['01', '|']);
  assert.deepEqual(result.warehouseCodes, ['01', '|']);
  assert.equal(result.total, 0);
  assert.deepEqual(calls.map(({ params }) => params), [['01', '|'], ['01', '|', 25, 0]]);
});
test('staging allows only the two new inventory GET routes', () => {
  const { isReadOnlyErpRequest } = load('src/presentation/staging-read-only.routes.ts');
  assert.equal(isReadOnlyErpRequest('GET', '/api/erp/products/inventory'), true);
  assert.equal(isReadOnlyErpRequest('GET', '/api/erp/products/inventory/warehouses'), true);
  assert.equal(isReadOnlyErpRequest('POST', '/api/erp/products/inventory'), false);
  assert.equal(isReadOnlyErpRequest('DELETE', '/api/erp/products/inventory'), false);
});

test('inventory routes require the internal key, including when configuration is missing', () => {
  let key = 'fixture-key';
  const { InternalApiKeyMiddleware } = load('src/presentation/middlewares/internal-api-key.middleware.ts', {
    '../../config/envs': { Envs: { getErpReadEnvs: () => ({ INTERNAL_API_KEY: key }) } },
  });
  for (const [provided, expected] of [['', 401], ['wrong', 401], ['fixture-key', 200]]) {
    let status = 200; let passed = false;
    const res = { status: code => { status = code; return res; }, json: () => {} };
    InternalApiKeyMiddleware.validateRequired({ header: () => provided }, res, () => { passed = true; });
    assert.equal(status, expected); assert.equal(passed, expected === 200);
  }
  key = '';
  let status;
  const res = { status: code => { status = code; return res; }, json: () => {} };
  InternalApiKeyMiddleware.validateRequired({ header: () => '' }, res, () => assert.fail('Must reject missing configuration'));
  assert.equal(status, 503);
});
