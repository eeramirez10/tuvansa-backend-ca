import { timingSafeEqual } from "node:crypto";
import { NextFunction, Request, Response } from "express";
import { Envs } from "../../config/envs";

export class InternalApiKeyMiddleware {
  public static validateRequired(req: Request, res: Response, next: NextFunction): void {
    const configuredKey = Envs.getErpReadEnvs().INTERNAL_API_KEY?.trim();
    if (!configuredKey) {
      res.status(503).json({ error: "Internal API key is not configured" });
      return;
    }
    InternalApiKeyMiddleware.validate(req, res, next);
  }

  public static validate(req: Request, res: Response, next: NextFunction): void {
    const configuredKey = Envs.getErpReadEnvs().INTERNAL_API_KEY?.trim();
    if (!configuredKey) {
      next();
      return;
    }

    const providedKey = req.header("X-Internal-Api-Key")?.trim() ?? "";
    if (!InternalApiKeyMiddleware.matches(configuredKey, providedKey)) {
      res.status(401).json({ error: "Invalid internal API key" });
      return;
    }

    next();
  }

  private static matches(expected: string, actual: string): boolean {
    const expectedBuffer = Buffer.from(expected);
    const actualBuffer = Buffer.from(actual);
    return expectedBuffer.length === actualBuffer.length && timingSafeEqual(expectedBuffer, actualBuffer);
  }
}
