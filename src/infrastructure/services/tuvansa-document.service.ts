import { FtpStorageAdapter } from "../../domain/adapters/ftp-storage.adapter";
import { DocumentService } from "../../domain/services/document-service";


export class TuvansaDocumentService extends DocumentService {

  constructor(private storage: FtpStorageAdapter) {
    super();
  }


  getPdf(remotePath: string) {

    return this.storage.download(remotePath);

  }

  getXml(remotePath: string) {
    return this.storage.download(remotePath);
  }

}