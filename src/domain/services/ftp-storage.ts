abstract class FtpStorage {
  

  abstract download(remotePath: string): Promise<Buffer>;

}