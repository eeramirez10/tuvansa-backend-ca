import { Router } from "express";

export function isReadOnlyErpRequest(method: string, path: string): boolean {
  const routes: Array<[string, RegExp]> = [
    ["GET", /^\/api\/erp\/products\/inventory(?:\/warehouses)?\/?$/],
    ["GET", /^\/api\/erp\/products\/(catalogs|search\/mexico|by-code\/[^/]+\/mexico|by-ean\/[^/]+\/branch\/[^/]+|ean-exact\/[^/]+|[^/]+\/availability)\/?$/],
    ["POST", /^\/api\/erp\/products\/(ean-references|search\/warehouses|availability\/batch)\/?$/],
    ["GET", /^\/api\/erp\/customers\/search\/?$/],
    ["GET", /^\/api\/erp\/(suppliers|orders|quotes)\/[^/]+\/?$/],
    ["GET", /^\/api\/erp-users(?:\/[^/]+)?\/?$/],
    ["GET", /^\/api\/branch-office\/[^/]+\/?$/],
    ["POST", /^\/api\/warehouse\/?$/],
  ];
  return routes.some(([verb, pattern]) => method === verb && pattern.test(path));
}

export function readOnlyErpGuard(): Router {
  const router = Router();
  router.use((req, res, next) => {
    if (!isReadOnlyErpRequest(req.method, req.path)) {
      res.status(403).json({ error: "This ERP instance only supports explicitly allowlisted read-only queries." });
      return;
    }
    next();
  });
  return router;
}
