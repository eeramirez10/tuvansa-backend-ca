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
import { UpdateUserDto } from '../../domain/dto/auth/update-user.dto';
import { AuthPaginationDto } from '../../domain/dto/auth/auth-pagination.dto';




export class AuthController {

  constructor(private readonly authRepository: AuthRepository<any, CreateAuthDto>) { }

  private handleError = (error: unknown, res: Response) => {

    if (error instanceof CustomError) {
      console.log(error)
      res.status(error.statusCode).json({ error: error.message })
      return
    }

    console.log(error)

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

  renewToken = (req: Request, res: Response) => {

    const user = (req as ReqUser).user


    new RenewTokenUseCase()
      .execute(user)
      .then((data) => {
        res.json(data)
      })
      .catch((error) => {
        console.log(error['message'])
        this.handleError(error, res)
      })
  }

  updateUser = async (req: Request, res: Response) => {

    const id = req.params.id as string;

    const body = req.body



    const [error, updateUserDto] = UpdateUserDto.execute({ ...body, id })


    if (error) {
      res.status(400).json({ error })
      return
    }

    try {



      const user = await this.authRepository.updateUser(updateUserDto!)

      res.json(user)

      return

    } catch (error) {
      console.log(error)

      this.handleError(error, res)
    }



  }

  getUser = async (req: Request, res: Response) => {

    const id = req.params.id as string;

    try {
      const user = await this.authRepository.getOne(id)

      res.json(user)
    } catch (error) {
      console.log(error)

      this.handleError(error, res)
    }


  }

  getUsers = async (req: Request, res: Response) => {


    const [error, authPaginationDto] = AuthPaginationDto.execute({ ...req.query })

    if (error) {
      res.status(400).json({ error })
      return
    }


    try {
      const user = await this.authRepository.getAll({ ...authPaginationDto! })

      res.json(user)
    } catch (error) {
      console.log(error)

      this.handleError(error, res)
    }


  }
}