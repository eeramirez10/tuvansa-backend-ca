
import { Router } from "express";
import express from 'express';
import cors from 'cors'
import http from 'node:http';
import https from 'node:https';
import { existsSync, readFileSync } from "node:fs";
import { Envs } from "../config/envs";


interface Options {
  port: number,
  routes: Router

}

export class Server {

  private app = express()
  private readonly port: number
  private readonly routes: Router

  constructor(options: Options) {
    this.port = options.port ?? 4600
    this.routes = options.routes
  }


  async start() {

    const HOST = '0.0.0.0';


    this.app.use(express.json()); // raw
    this.app.use(express.urlencoded({ extended: true })); // x-www-form-urlencoded
    this.app.use(cors())
    // this.app.use( compression() )


    //routes


    this.app.use(this.routes)


    const httpServer = this.createHttpsServer({
      path: Envs.getEnvs().PATH_CERT,
      privkey: Envs.getEnvs().PRIVKEY,
      cert: Envs.getEnvs().CERT,
      chain: Envs.getEnvs().CHAIN
    })

    if (!httpServer) {
      this.app.listen(this.port, HOST, () => {
        console.log(`Server running on port ${this.port}`);
      });
    }




  }

  private createHttpsServer(options: {
    path: string
    privkey: string
    cert: string
    chain?: string,
  }): Boolean {

    const {
      path,
      privkey,
      cert,
      chain,
    } = options;

    const existPathCert = existsSync(path)
    console.log({ existPathCert })

    if (!existPathCert) return false

    let privateKey = readFileSync(`${path}/${privkey}`, 'utf8')
    let certificate = readFileSync(`${path}/${cert}`, 'utf8');
    let ca = chain ? readFileSync(`${path}/${chain}`, 'utf8') : '';

    const credentials = {
      key: privateKey,
      cert: certificate,
      ca
    }

    const httpServer = http.createServer(this.app)
    const httpsServer = https.createServer(credentials, this.app)

    httpServer.listen(80, () => {
      console.log(`Server listen in port 80`)
    })

    httpsServer.listen(443, () => {
      console.log('Server https running on port 443')
    })

    return true

  }


}