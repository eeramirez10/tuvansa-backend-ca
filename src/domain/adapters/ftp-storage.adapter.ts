export abstract class FtpStorageAdapter {

  abstract download(remotePath: string): Promise<Buffer>;

}