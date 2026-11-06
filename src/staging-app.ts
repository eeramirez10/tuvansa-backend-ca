import express from "express";
import { Envs } from "./config/envs";
import { pool } from "./infrastructure/database/proscai.mysql-connection";
import { readOnlyErpGuard } from "./presentation/staging-read-only.routes";
import { InternalApiKeyMiddleware } from "./presentation/middlewares/internal-api-key.middleware";
import { ProductsRoutes } from "./presentation/products/routes";
import { ErpCustomersRoutes } from "./presentation/erp-customers/routes";
import { ErpSuppliersRoutes } from "./presentation/erp-suppliers/routes";
import { ErpOrdersRoutes } from "./presentation/erp-orders/routes";
import { ErpQuotesRoutes } from "./presentation/erp-quotes/routes";
import { ErpUsersRoutes } from "./presentation/erp-users/routes";
import { WarehouseRoutes } from "./presentation/warehouse/routes";
import { BranchOfficeRoutes } from "./presentation/branch-office/routes";
import { acceptsExistingStagingCredentials, assertReadOnlyGrants } from "./presentation/staging-read-only-grants";

async function start(): Promise<void> {
  if (process.env.STAGING_MODE !== "true") throw new Error("The read-only staging entrypoint requires STAGING_MODE=true.");
  const config = Envs.getErpReadEnvs();
  if (!config.INTERNAL_API_KEY) throw new Error("INTERNAL_API_KEY is required for ERP staging.");
  const existingCredentials = acceptsExistingStagingCredentials(process.env);
  if (existingCredentials) {
    await pool.query("SELECT 1");
    console.warn(JSON.stringify({
      event: "staging_erp.existing_credentials_authorized", queryOnlyApi: true,
      databasePrivilegesVerified: false,
      message: "Using operator-authorized existing credentials; database write protection is managed externally.",
    }));
  } else {
    const [rows] = await pool.query("SHOW GRANTS FOR CURRENT_USER()");
    assertReadOnlyGrants((rows as Array<Record<string, string>>).flatMap((row) => Object.values(row)));
  }
  const app = express();
  app.disable("x-powered-by");
  app.get("/health/ready", async (_req, res) => {
    try { await pool.query("SELECT 1"); res.json({ ok: true, readOnly: true, databasePrivilegesVerified: !existingCredentials }); }
    catch { res.status(503).json({ ok: false }); }
  });
  app.use(readOnlyErpGuard(), InternalApiKeyMiddleware.validateRequired, express.json({ limit: "1mb" }));
  app.use("/api/erp/products", ProductsRoutes.routes());
  app.use("/api/erp/customers", ErpCustomersRoutes.routes());
  app.use("/api/erp/suppliers", ErpSuppliersRoutes.routes());
  app.use("/api/erp/orders", ErpOrdersRoutes.routes());
  app.use("/api/erp/quotes", ErpQuotesRoutes.routes());
  app.use("/api/erp-users", ErpUsersRoutes.routes());
  app.use("/api/warehouse", WarehouseRoutes.routes());
  app.use("/api/branch-office", BranchOfficeRoutes.routes());
  const server = app.listen(config.PORT, "0.0.0.0", () => console.log("Read-only ERP staging started."));
  const stop = () => { server.close(() => { void pool.end().then(() => process.exit(0)); }); };
  process.on("SIGTERM", stop);
  process.on("SIGINT", stop);
}

void start().catch((error) => { console.error(error.message); process.exitCode = 1; });
