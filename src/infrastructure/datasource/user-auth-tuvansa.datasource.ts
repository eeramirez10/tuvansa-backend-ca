import { AuthDatasource } from "../../domain/datasource/auth.datasource";
import { CheckFieldDto } from "../../domain/dto/auth/check-field.dto";
import { CreateUserDto } from "../../domain/dto/auth/create-user.dto";
import { LoginDto } from "../../domain/dto/auth/login-user.dto";
import { UserEntity } from "../../domain/entities/user";
import { CustomError } from "../../domain/errors/custom-error";

import { Branch, PrismaClient } from '@prisma/client'
import { BcryptAdapter } from "../adapters/bcrypt-adapter";


const prismaClient = new PrismaClient();

type HashFunction = (password: string) => string;
type CompareFunction = (password: string, hashed: string) => boolean;

export class UserAuthTuvansaDatasource implements AuthDatasource<UserEntity | null, CreateUserDto> {


  constructor(
    private readonly hashPassword: HashFunction = BcryptAdapter.hash,
    private readonly comparePassword: CompareFunction = BcryptAdapter.compare
  ) {

  }


  async login(loginDto: LoginDto): Promise<UserEntity | null> {

    const { email, password } = loginDto

    const user = await prismaClient.user.findFirst({
      where: {
        email,
      }

    })

    if (!user) throw CustomError.notFound('User not found')

    if (!this.comparePassword(password, user!.password)) throw CustomError.BadRequest('Incorrect Password')


    return user

  }

  async create(dto: CreateUserDto): Promise<UserEntity> {
    const { password, ...rest } = dto

    const existUser = await prismaClient.user.findUnique({ where: { email: rest.email } })

    if (existUser) {
      throw CustomError.BadRequest('User already exist')
    }

    const hashedPassword = this.hashPassword(password)



    const newUser = await prismaClient.user.create({
      data: {
        ...rest,
        password: hashedPassword,
      }
    })

    return newUser
  }
  async checkField(checkFieldDto: CheckFieldDto): Promise<Boolean> {
    const { field, value } = checkFieldDto
    const user = await prismaClient.user.findFirst({
      where: {
        [field]: value
      }
    })

    return Boolean(user)
  }

}