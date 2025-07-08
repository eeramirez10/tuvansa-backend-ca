import express, { Router } from 'express';
import { UserAuthTuvansaDatasource } from '../../infrastructure/datasource/user-auth-tuvansa.datasource';
import { UserAuthRepositoryImpl } from '../../infrastructure/repositories/user-auth-repositoryImpl';
import { AuthController } from './controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';



export class AuthRoutes {

  static routes(): Router {
    const app = express.Router()

    const datasource = new UserAuthTuvansaDatasource()

    const repository = new UserAuthRepositoryImpl(datasource)
    const controller = new AuthController(repository)


    app.post('/user', controller.loginUser)
    app.post('/user/register', controller.createUser)
    app.get('/user/renew', AuthMiddleware.validateJWT, controller.renewToken)
    app.patch('/user/:id', AuthMiddleware.validateJWT, controller.updateUser)
    app.get('/user/:id', AuthMiddleware.validateJWT, controller.getUser)
    app.get('/user', AuthMiddleware.validateJWT, controller.getUsers)


    return app
  }
}