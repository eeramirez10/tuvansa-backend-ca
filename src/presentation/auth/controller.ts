import { Response, Request } from 'express';
import { CreateAuthDto } from '../../domain/dto/auth/create-auth.dto';

import { AuthRepository } from '../../domain/repositories/auth.repository';
import { LoginDto } from '../../domain/dto/auth/login-user.dto';
import { LoginUserUseCase } from '../../use-cases/auth/login-user.use-case';
import { CustomError } from '../../domain/errors/custom-error';
import { CreateUserDto } from '../../domain/dto/auth/create-user.dto';
import { RegisterUserUseCase } from '../../use-cases/auth/register-user.use-case';
import { RenewTokenUseCase } from '../../use-cases/auth/renew-token.use-case';
import { ReqUser } from '../middlewares/auth.middleware';




export class AuthController {

  constructor(private readonly authRepository: AuthRepository<any, CreateAuthDto>) { }

  private handleError = (error: unknown, res: Response) => {

    if (error instanceof CustomError) {
      console.log(error)
      res.status(error.statusCode).json({ error: error.message })
      return
    }



    res.status(500).json({ error: 'Error desconocido' })
  }


  loginUser = (req: Request, res: Response) => {

    const [error, loginDto] = LoginDto.execute({ ...req.body })



    if (error) {
      res.status(400).json({ error })
      return
    }

    new LoginUserUseCase(this.authRepository)
      .execute(loginDto!)
      .then((user) => {
        res.json(user)
      })
      .catch((e) => {

        // res.status(500).json({ error: 'Valio verga'})

        this.handleError(e, res)
      })

  }


  createUser = (req: Request, res: Response) => {
    const [error, createUserDto] = CreateUserDto.execute({ ...req.body })

    if (error) {
      res.status(400).json({ error })
      return
    }


    new RegisterUserUseCase(this.authRepository)
      .execute(createUserDto!)
      .then((user) => {
        res.json(user)
      })
      .catch(e => {
        console.log(e)
        this.handleError(e, res)
      })

  }

  renewToken = (req: ReqUser, res: Response) => {

    const user = req.user


    new RenewTokenUseCase()
      .execute(user!)
      .then((data) => {
        res.json(data)
      })
      .catch((error) => {
        console.log(error['message'])
        this.handleError(error, res)
      })
  }
}