const assert = require('node:assert/strict');
const { test } = require('node:test');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

test('identity uses exact bound ICOD and account without needing stock, cost or a unique EAN', async () => {
  const source = fs.readFileSync('src/infrastructure/datasource/proscai-product-identity.datasource.ts', 'utf8');
  const sqlCalls = [];
  const products = [
    { code: '01300938', ean: 'TSC480', description: 'Tubo Mexico', unit: 'M', account: '1115001' },
    { code: '02300938', ean: 'TSC480', description: 'Tubo Monterrey', unit: 'M', account: '1115002' },
  ];
  const pool = { query: async (sql, [code, account]) => {
    sqlCalls.push(sql);
    return [products.filter(row => row.code === code && row.account === account)];
  } };
  const exports = {};
  vm.runInNewContext(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, {
    exports, require: () => ({ pool }),
  });
  const lookup = new exports.ProscaiProductIdentityDatasource();
  assert.equal((await lookup.find('01300938', '1115001')).ean, 'TSC480');
  assert.equal((await lookup.find('02300938', '1115002')).ean, 'TSC480');
  assert.equal(await lookup.find('01300938', '1115002'), null);
  for (const sql of sqlCalls) {
    assert.match(sql, /WHERE p\.ICOD = \? AND p\.ICTA = \?/);
    assert.doesNotMatch(sql, /FALM|ALMCANT|ILISTA|LIKE|INSERT|DELETE|UPDATE|01300938/);
  }
});
