"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalApiKeyMiddleware = void 0;
const node_crypto_1 = require("node:crypto");
const envs_1 = require("../../config/envs");
class InternalApiKeyMiddleware {
    static validateRequired(req, res, next) {
        var _a;
        const configuredKey = (_a = envs_1.Envs.getEnvs().INTERNAL_API_KEY) === null || _a === void 0 ? void 0 : _a.trim();
        if (!configuredKey) {
            res.status(503).json({ error: "Internal API key is not configured" });
            return;
        }
        InternalApiKeyMiddleware.validate(req, res, next);
    }
    static validate(req, res, next) {
        var _a, _b, _c;
        const configuredKey = (_a = envs_1.Envs.getEnvs().INTERNAL_API_KEY) === null || _a === void 0 ? void 0 : _a.trim();
        if (!configuredKey) {
            next();
            return;
        }
        const providedKey = (_c = (_b = req.header("X-Internal-Api-Key")) === null || _b === void 0 ? void 0 : _b.trim()) !== null && _c !== void 0 ? _c : "";
        if (!InternalApiKeyMiddleware.matches(configuredKey, providedKey)) {
            res.status(401).json({ error: "Invalid internal API key" });
            return;
        }
        next();
    }
    static matches(expected, actual) {
        const expectedBuffer = Buffer.from(expected);
        const actualBuffer = Buffer.from(actual);
        return expectedBuffer.length === actualBuffer.length && (0, node_crypto_1.timingSafeEqual)(expectedBuffer, actualBuffer);
    }
}
exports.InternalApiKeyMiddleware = InternalApiKeyMiddleware;
