import { DocumentService } from '../../domain/services/document-service';


export class GetInvoicePdfFileUseCase {

  constructor(private documentService: DocumentService) { }

  async execute(remotePath: string) {



    return await this.documentService.getPdf(remotePath)




  }
}