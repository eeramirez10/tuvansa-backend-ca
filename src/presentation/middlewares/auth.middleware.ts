import { NextFunction, Request, Response } from 'express';

import { PrismaClient } from '@prisma/client';
import { JwtAdapter } from '../../infrastructure/adapters/jwt-adapter';
import { UserEntity } from '../../domain/entities/user';


export interface ReqUser extends Request {
  user: UserEntity
}


const prismaClient = new PrismaClient()

export class AuthMiddleware {



  static validateJWT = async (req: Request, res: Response, next: NextFunction) => {

    const authorization = req.header('Authorization');
    if (!authorization) {
      res.status(401).json({ error: 'No token provided' });
      return
    }


    if (!authorization.startsWith('Bearer ')) {

      res.status(401).json({ error: 'Invalid Bearer token' });
      return
    }

    const token = authorization.split(' ').at(1) || '';

    if (!token) {
      res.status(401).json({ error: 'No token provided' });

      return
    }

    try {

      // todo:
      const payload = await JwtAdapter.validateToken<{ id: string }>(token);

      if (!payload) {
        res.status(401).json({ error: 'Invalid token' });
        return
      }


      const user = await prismaClient.user.findFirst({ where: { id: payload.id } });

      if (!user) {
        res.status(401).json({ error: 'Invalid token - user not found' })
        return
      }

    
      (req as ReqUser ).user = user;


      next();
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Internal server error' });
    }




  }


}

