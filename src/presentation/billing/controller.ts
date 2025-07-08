import { Request, Response } from "express";
import { InvoicesRepository } from "../../domain/repositories/invoices-repository";
import { InvoicePaginationDto } from "../../domain/dto/invoice-pagination.dto";
import { GetInvoicesUseCase } from "../../use-cases/billing/get-invoices.use-case.dto";
import { DocumentService } from '../../domain/services/document-service';
import { FileDto } from "../../domain/dto/file.dto";
import { GetInvoicePdfFileUseCase } from "../../use-cases/billing/get-invoice-pdf-file.use-case.dto";
import { CustomError } from "../../domain/errors/custom-error";
import { ReqUser } from "../middlewares/auth.middleware";


type FileType = 'pdf' | 'xml'


export class BillingController {

  constructor(private readonly invoicesRepository: InvoicesRepository, private readonly documentService: DocumentService) {


  }

  getInvoices = (req: Request, res: Response) => {

     const user = (req as ReqUser).user

     console.log(user)

    const [error, invoicePaginationDto] = InvoicePaginationDto.execute({ ...req.query, ...user })

    if (error) {

      res.status(400).json({ error })
      return
    }

    // console.log({ repo: this.invoicesRepository})

    new GetInvoicesUseCase(this.invoicesRepository)
      .execute(invoicePaginationDto!)
      .then((resp) => {
        res.json({ ...resp })
      })
      .catch((e) => {
        console.log(e)
        res.status(500).json({ error: 'hubo un error' })
      })



  }

  getInvoiceFile = (req: Request, res: Response) => {



    const [error, fileDto] = FileDto.exec({ ...req.body });

    if (error) {

      res.status(400).json({ error })

      return
    }

    console.log(fileDto)

    const invoicesPath = `/facturas-proscai/${fileDto?.filename}`


    new GetInvoicePdfFileUseCase(this.documentService)
      .execute(invoicesPath)
      .then(resp => {
        res
          .status(200)
          .header('Content-Type', `application/${fileDto!.type}`)
          .header("Content-Disposition", `attachment; filename="${fileDto!.filename}"`)
          .send(resp);
      })
      .catch(error => {
        if (error instanceof CustomError) {

          res.status(error.statusCode).json({ error: error.message })
        }


      })




  }



}