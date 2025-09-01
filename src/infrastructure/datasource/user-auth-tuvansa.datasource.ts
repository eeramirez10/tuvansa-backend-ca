import { AuthDatasource } from "../../domain/datasource/auth.datasource";
import { CheckFieldDto } from "../../domain/dto/auth/check-field.dto";
import { CreateUserDto } from "../../domain/dto/auth/create-user.dto";
import { LoginDto } from "../../domain/dto/auth/login-user.dto";
import { UserEntity } from "../../domain/entities/user";
import { CustomError } from "../../domain/errors/custom-error";

import { PrismaClient } from '@prisma/client'
import { BcryptAdapter } from "../adapters/bcrypt-adapter";
import { PaginationResult } from "../../domain/entities/pagination-result";
import { AuthPaginationDto } from "../../domain/dto/auth/auth-pagination.dto";



const prismaClient = new PrismaClient();

type HashFunction = (password: string) => string;
type CompareFunction = (password: string, hashed: string) => boolean;

export class UserAuthTuvansaDatasource implements AuthDatasource<UserEntity | null, CreateUserDto> {


  constructor(
    private readonly hashPassword: HashFunction = BcryptAdapter.hash,
    private readonly comparePassword: CompareFunction = BcryptAdapter.compare
  ) {

  }



  async getOne(id: string): Promise<UserEntity | null> {
    return await prismaClient.user.findUnique({ where: { id } })
  }


  async getAll(authPaginationDto: AuthPaginationDto): Promise<PaginationResult<UserEntity>> {

    const { page, pageSize } = authPaginationDto

    const skip = (authPaginationDto.page - 1) * authPaginationDto.pageSize;

    const search = authPaginationDto.search?.toString().trim() || undefined;

    

    const usersPromise = prismaClient.user.findMany({
      take: authPaginationDto.pageSize,
      skip,
      where: search ? {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
          { username: { contains: search, mode: 'insensitive' } },
          { lastname: { contains: search, mode: 'insensitive' } },
        ]
      } : {}


    })

    const countUsersPromise = prismaClient.user.count({
      where: search ? {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
          { username: { contains: search, mode: 'insensitive' } },
          { lastname: { contains: search, mode: 'insensitive' } },
        ]
      } : {}
    })

    const [items, total] = await Promise.all([usersPromise, countUsersPromise])

    const totalPages = Math.ceil(total / pageSize);

    return {
      items,
      total,
      page,
      pageSize,
      totalPages,
    }
  }


  async updateUser(updateUserDto: Record<string, any>): Promise<UserEntity> {

    const { id, ...data } = updateUserDto


    if (data.password) {
      const hashedPassword = this.hashPassword(data.password);
      data.password = hashedPassword
    }

    const user = await prismaClient.user.findUnique({ where: { id } })

   

    if (!user) throw CustomError.BadRequest('User not exist')

    const updateUser = await prismaClient.user.update({
      where: { id },
      data: data
    })

    return updateUser

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