const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

function load(path) {
  const source = fs.readFileSync(path, 'utf8');
  const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const module = { exports: {} };
  vm.runInNewContext(js, { exports: module.exports, module, require });
  return module.exports;
}
const { acceptsExistingStagingCredentials, assertReadOnlyGrants } = load('src/presentation/staging-read-only-grants.ts');
const { isReadOnlyErpRequest } = load('src/presentation/staging-read-only.routes.ts');

test('existing credentials need explicit opt-in and can only be enabled in staging', () => {
  assert.equal(acceptsExistingStagingCredentials({}), false);
  assert.equal(acceptsExistingStagingCredentials({ STAGING_MODE: 'true' }), false);
  assert.equal(acceptsExistingStagingCredentials({ STAGING_MODE: 'false', STAGING_ERP_ALLOW_EXISTING_CREDENTIALS: 'true' }), false);
  assert.equal(acceptsExistingStagingCredentials({ STAGING_MODE: 'true', STAGING_ERP_ALLOW_EXISTING_CREDENTIALS: 'false' }), false);
  assert.equal(acceptsExistingStagingCredentials({ STAGING_MODE: 'true', STAGING_ERP_ALLOW_EXISTING_CREDENTIALS: 'true' }), true);
});

test('ERP staging refuses privileged MySQL credentials', () => {
  assert.doesNotThrow(() => assertReadOnlyGrants(["GRANT USAGE ON *.* TO 'reader'@'%'", "GRANT SELECT, SHOW VIEW ON proscai.* TO 'reader'@'%'"]));
  for (const grant of ["GRANT ALL PRIVILEGES ON *.* TO 'admin'@'%'", "GRANT SELECT, INSERT ON proscai.* TO 'writer'@'%'", "GRANT 'admin_role'@'%' TO 'reader'@'%'", "GRANT SELECT ON proscai.* TO 'reader'@'%' WITH GRANT OPTION"]) {
    assert.throws(() => assertReadOnlyGrants([grant]));
  }
});
test('ERP staging accepts query POSTs without allowing writes or communications', () => {
  for (const [method, path] of [
    ['GET', '/api/erp/products/catalogs'], ['POST', '/api/erp/products/ean-references'],
    ['POST', '/api/erp/products/availability/batch'], ['POST', '/api/erp/products/search/warehouses'],
    ['GET', '/api/erp/orders/P021827'], ['GET', '/api/erp/customers/search'],
  ]) assert.equal(isReadOnlyErpRequest(method, path), true);
  for (const [method, path] of [
    ['POST', '/api/auth/user/register'], ['POST', '/api/account-statements/send-email'],
    ['PATCH', '/api/erp/products/catalogs'], ['DELETE', '/api/erp/suppliers/123'],
    ['POST', '/api/erp/products/import'], ['GET', '/api/erp/customers/monthly-sales-summary'],
  ]) assert.equal(isReadOnlyErpRequest(method, path), false);
});
