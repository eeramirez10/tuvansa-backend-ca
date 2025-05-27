import { AccessOptions, Client, FTPError } from "basic-ftp";
import { FtpStorageAdapter } from "../../domain/adapters/ftp-storage.adapter";
import { PassThrough } from "stream";
import { CustomError } from "../../domain/errors/custom-error";

export class BasicFtpStorageAdapter extends FtpStorageAdapter {

  private client: Client;
  private opts: AccessOptions;

  constructor() {
    super();
    this.client = new Client();
    this.opts = {
      host: process.env.FTP_HOST!,
      port: Number(process.env.FTP_PORT || 21),
      user: process.env.FTP_USER!,
      password: process.env.FTP_PASS!,
      secure: process.env.FTP_SECURE === 'true',
    };
  }

  async download(remotePath: string): Promise<Buffer> {

    try {

      await this.client.access(this.opts);
      const pass = new PassThrough();
      const chunks: Buffer[] = [];
      pass.on('data', (chunk: Buffer) => chunks.push(chunk));

      // Lo pasamos como destino al downloadTo
      await this.client.downloadTo(pass, remotePath);
      await this.client.close();

      return Buffer.concat(chunks);

    } catch (error) {

      if (error instanceof FTPError) {

        if (error.code === 550) {

          throw CustomError.notFound('File not found')
        }

      }

      throw new Error('Erroro desconocido')
    }

  }

}