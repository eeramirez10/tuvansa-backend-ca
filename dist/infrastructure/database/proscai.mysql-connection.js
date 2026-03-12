"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
const promise_1 = __importDefault(require("mysql2/promise"));
const dotenv_1 = __importDefault(require("dotenv"));
const envs_1 = require("../../config/envs");
dotenv_1.default.config();
const { HOST_DB_MYSQL, USER_MYSQL, PASSWORD_MYSQL, DATABASE_MYSQL, } = envs_1.Envs.getEnvs();
exports.pool = promise_1.default.createPool({
    host: HOST_DB_MYSQL,
    user: USER_MYSQL,
    password: PASSWORD_MYSQL,
    database: DATABASE_MYSQL,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    debug: false
});
