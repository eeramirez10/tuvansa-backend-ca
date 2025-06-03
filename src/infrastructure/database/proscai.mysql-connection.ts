import mysql, { Pool } from 'mysql2/promise';
import dotenv from 'dotenv';
import { Envs } from '../../config/envs';
dotenv.config();


const {
  HOST_DB_MYSQL,
  USER_MYSQL,
  PASSWORD_MYSQL,
  DATABASE_MYSQL,
} = Envs.getEnvs()

export const pool: Pool = mysql.createPool({
  host: HOST_DB_MYSQL,
  user: USER_MYSQL,
  password: PASSWORD_MYSQL,
  database: DATABASE_MYSQL,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  debug: true
});