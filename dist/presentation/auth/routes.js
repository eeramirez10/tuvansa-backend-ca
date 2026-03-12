"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_auth_tuvansa_datasource_1 = require("../../infrastructure/datasource/user-auth-tuvansa.datasource");
const user_auth_repositoryImpl_1 = require("../../infrastructure/repositories/user-auth-repositoryImpl");
const controller_1 = require("./controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
class AuthRoutes {
    static routes() {
        const app = express_1.default.Router();
        const datasource = new user_auth_tuvansa_datasource_1.UserAuthTuvansaDatasource();
        const repository = new user_auth_repositoryImpl_1.UserAuthRepositoryImpl(datasource);
        const controller = new controller_1.AuthController(repository);
        app.post('/user', controller.loginUser);
        app.post('/user/register', controller.createUser);
        app.get('/user/renew', auth_middleware_1.AuthMiddleware.validateJWT, controller.renewToken);
        app.patch('/user/:id', auth_middleware_1.AuthMiddleware.validateJWT, controller.updateUser);
        app.get('/user/:id', auth_middleware_1.AuthMiddleware.validateJWT, controller.getUser);
        app.get('/user', auth_middleware_1.AuthMiddleware.validateJWT, controller.getUsers);
        return app;
    }
}
exports.AuthRoutes = AuthRoutes;
