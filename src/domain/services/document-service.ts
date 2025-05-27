export abstract class DocumentService {
 
  abstract getPdf(remotePath: string):Promise<Buffer>

  abstract getXml(remotePath: string):Promise<Buffer>
}