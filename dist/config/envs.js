"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Envs = void 0;
const env_var_1 = require("env-var");
require("dotenv/config");
class Envs {
    static getEnvs() {
        var _a;
        return {
            PORT: (0, env_var_1.get)('PORT').required().asPortNumber(),
            HOST_DB_MYSQL: (0, env_var_1.get)('HOST_DB_MYSQL').required().asString(),
            USER_MYSQL: (0, env_var_1.get)('USER_MYSQL').required().asString(),
            PASSWORD_MYSQL: (0, env_var_1.get)('PASSWORD_MYSQL').required().asString(),
            DATABASE_MYSQL: (0, env_var_1.get)('DATABASE_MYSQL').required().asString(),
            FTP_HOST: (0, env_var_1.get)('FTP_HOST').required().asString(),
            FTP_PORT: (0, env_var_1.get)('FTP_PORT').required().asPortNumber(),
            FTP_USER: (0, env_var_1.get)('FTP_USER').required().asString(),
            FTP_PASS: (0, env_var_1.get)('FTP_PASS').required().asString(),
            FTP_SECURE: (_a = (0, env_var_1.get)('FTP_SECURE').required().asBool()) !== null && _a !== void 0 ? _a : false,
            JWT_SEED: (0, env_var_1.get)('JWT_SEED').required().asString(),
            PATH_CERT: (0, env_var_1.get)('PATH_CERT').required().asString(),
            PRIVKEY: (0, env_var_1.get)('PRIVKEY').required().asString(),
            CERT: (0, env_var_1.get)('CERT').required().asString(),
            CHAIN: (0, env_var_1.get)('CHAIN').required().asString(),
        };
    }
}
exports.Envs = Envs;
