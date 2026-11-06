const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

const load = (execute) => {
  const source = fs.readFileSync('src/infrastructure/datasource/proscai-ean-lookup.datasource.ts', 'utf8');
  const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const module = { exports: {} };
  vm.runInNewContext(js, { exports: module.exports, module, require: (name) => {
    assert.equal(name, '../database/proscai.mysql-connection');
    return { pool: { execute } };
  } });
  return module.exports;
};

test('Mexico references bind literal EAN prefixes and never depend on stock or costs', async () => {
  let calls = 0;
  const { ProscaiEanLookupDatasource } = load(async (sql, params) => {
    calls++;
    assert.match(sql, /^\s*SELECT/);
    assert.match(sql, /p\.ICOD LIKE '01%'/);
    assert.match(sql, /p\.ITIPO = 1/);
    assert.match(sql, /d\.I2DESCR AS EXTENDED_DESCRIPTION/);
    assert.match(sql, /NO USAR\|NO UTILIZAR\|OBSOLETO\|DUPLICAD/);
    assert.doesNotMatch(sql, /FALM|ILISTA|INSERT|UPDATE|DELETE/);
    assert.deepEqual(Array.from(params), ['VB2150%', 'VB2%', 'VB2150%']);
    return [[{ ICOD: '01400500', IEAN: 'VB2150AB', IDESCR: 'Corta', EXTENDED_DESCRIPTION: 'Descripción extendida', FAMILY: 'B009', ITIPO: 1 }]];
  });
  const result = await new ProscaiEanLookupDatasource().findMexicoReferences(['VB2150', 'VB2']);
  assert.equal(calls, 1);
  assert.equal(result.references[0].description, 'Descripción extendida');
  assert.equal(result.references[0].branchCode, '01');
  assert.equal(result.hasMore, false);
});

test('invalid prefixes are rejected before touching the database', async () => {
  const { ProscaiEanLookupDatasource, parseEanReferencePrefixes } = load(async () => { throw new Error('SQL must not run'); });
  for (const value of [[], ['%'], ['VB_'], ['VB;DROP'], ['VB2%'], [123], null, Array(9).fill('VB')]) {
    assert.equal(parseEanReferencePrefixes(value), null);
    await assert.rejects(new ProscaiEanLookupDatasource().findMexicoReferences(value), /Invalid EAN/);
  }
});

test('large result sets remain bounded and expose truncation', async () => {
  const { ProscaiEanLookupDatasource } = load(async () => [Array.from({ length: 101 }, (_, index) => ({
    ICOD: `01${index}`, IEAN: 'TSC440', IDESCR: 'Tubo', EXTENDED_DESCRIPTION: null, FAMILY: null, ITIPO: 1,
  }))]);
  const result = await new ProscaiEanLookupDatasource().findMexicoReferences(['TSC440']);
  assert.equal(result.references.length, 100);
  assert.equal(result.hasMore, true);
});
