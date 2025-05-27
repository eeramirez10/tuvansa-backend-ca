import { PrismaClient } from "@prisma/client";
import { AuthDatasource } from "../../domain/datasource/auth.datasource";
import { CheckFieldDto } from "../../domain/dto/auth/check-field.dto";
import { LoginDto } from "../../domain/dto/auth/login-user.dto";
import { CreateClientDto } from "../../domain/dto/client/create-client.dto";
import { ClientEntity } from "../../domain/entities/client.entity";
import { BcryptAdapter } from "../adapters/bcrypt-adapter";
import { CustomError } from "../../domain/errors/custom-error";


const prismaClient = new PrismaClient()

type HashFunction = (password: string) => string;
type CompareFunction = (password: string, hashed: string) => boolean;

export class ClientAuthDatasource implements AuthDatasource<ClientEntity, CreateClientDto> {

  constructor(
    private readonly hashPassword: HashFunction = BcryptAdapter.hash,
    private readonly comparePassword: CompareFunction = BcryptAdapter.compare
  ) {

  }

  async login(loginDto: LoginDto): Promise<ClientEntity> {
    const { email, password } = loginDto


    const client = await prismaClient.client.findFirst({
      where: { email }
    })

    if (!client) throw CustomError.BadRequest('Email was not Found')

    if (!this.comparePassword(password, client.password)) throw CustomError.BadRequest('Incorrect Password')


    return client
  }

  async create(dto: CreateClientDto): Promise<ClientEntity> {
    const { password, ...rest } = dto

    const existUser = await prismaClient.client.findUnique({ where: { email: rest.email } })

    if (existUser) {
      throw CustomError.BadRequest('User already exist')
    }

    const hashedPassword = this.hashPassword(password)

    const newClient = await prismaClient.client.create({
      data: {
        ...rest,
        password: hashedPassword,
      }
    })

    return newClient
  }
  checkField(checkFieldDto: CheckFieldDto): Promise<Boolean> {
    throw new Error("Method not implemented.");
  }

}