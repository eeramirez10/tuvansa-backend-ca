import { get } from "env-var";
import 'dotenv/config'

export class Envs {

  static getEnvs() {
    return {

      PORT: get('PORT').required().asPortNumber(),
      HOST_DB_MYSQL: get('HOST_DB_MYSQL').required().asString(),
      USER_MYSQL: get('USER_MYSQL').required().asString(),
      PASSWORD_MYSQL: get('PASSWORD_MYSQL').required().asString(),
      DATABASE_MYSQL: get('DATABASE_MYSQL').required().asString(),
      FTP_HOST: get('FTP_HOST').required().asString(),
      FTP_PORT: get('FTP_PORT').required().asPortNumber(),
      FTP_USER: get('FTP_USER').required().asString(),
      FTP_PASS: get('FTP_PASS').required().asString(),
      FTP_SECURE: get('FTP_SECURE').required().asBool() ?? false,
      JWT_SEED: get('JWT_SEED').required().asString(),
      PATH_CERT: get('PATH_CERT').required().asString(),
      PRIVKEY: get('PRIVKEY').required().asString(),
      CERT: get('CERT').required().asString(),
      CHAIN: get('CHAIN').required().asString(),
      EMAIL_ACCOUNT: get('EMAIL_ACCOUNT').required().asString(),
      EMAIL_PASSWORD: get('EMAIL_PASSWORD').required().asString(),
      MAIL_SERVICE: get('MAIL_SERVICE').asString(),
      EMAIL_HOST: get('EMAIL_HOST').asString(),
    }
  }
}