"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const node_http_1 = __importDefault(require("node:http"));
const node_https_1 = __importDefault(require("node:https"));
const node_fs_1 = require("node:fs");
const envs_1 = require("../config/envs");
class Server {
    constructor(options) {
        var _a;
        this.app = (0, express_1.default)();
        this.port = (_a = options.port) !== null && _a !== void 0 ? _a : 4600;
        this.routes = options.routes;
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            const HOST = '0.0.0.0';
            this.app.use(express_1.default.json()); // raw
            this.app.use(express_1.default.urlencoded({ extended: true })); // x-www-form-urlencoded
            this.app.use((0, cors_1.default)());
            // this.app.use( compression() )
            //routes
            this.app.use(this.routes);
            const httpServer = this.createHttpsServer({
                path: envs_1.Envs.getEnvs().PATH_CERT,
                privkey: envs_1.Envs.getEnvs().PRIVKEY,
                cert: envs_1.Envs.getEnvs().CERT,
                chain: envs_1.Envs.getEnvs().CHAIN
            });
            if (!httpServer) {
                this.app.listen(this.port, HOST, () => {
                    console.log(`Server running on port ${this.port}`);
                });
            }
        });
    }
    createHttpsServer(options) {
        const { path, privkey, cert, chain, } = options;
        const existPathCert = (0, node_fs_1.existsSync)(path);
        console.log({ existPathCert });
        if (!existPathCert)
            return false;
        let privateKey = (0, node_fs_1.readFileSync)(`${path}/${privkey}`, 'utf8');
        let certificate = (0, node_fs_1.readFileSync)(`${path}/${cert}`, 'utf8');
        let ca = chain ? (0, node_fs_1.readFileSync)(`${path}/${chain}`, 'utf8') : '';
        const credentials = {
            key: privateKey,
            cert: certificate,
            ca
        };
        const httpServer = node_http_1.default.createServer(this.app);
        const httpsServer = node_https_1.default.createServer(credentials, this.app);
        httpServer.listen(80, () => {
            console.log(`Server listen in port 80`);
        });
        httpsServer.listen(443, () => {
            console.log('Server https running on port 443');
        });
        return true;
    }
}
exports.Server = Server;
