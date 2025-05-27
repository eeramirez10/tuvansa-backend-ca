import { UserEntity } from "../../domain/entities/user";


declare global {
  namespace Express {
    export interface Request {
      user?: UserEntity
    }
  }
}