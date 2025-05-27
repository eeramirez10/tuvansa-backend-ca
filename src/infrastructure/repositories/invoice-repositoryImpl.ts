import { InvoicesDatasource } from "../../domain/datasource/invoices-datasource";
import { InvoicePaginationDto } from "../../domain/dto/invoice-pagination.dto";
import { InvoiceEntity } from "../../domain/entities/invoice-entity";
import { PaginationResult } from "../../domain/entities/pagination-result";
import { InvoicesRepository } from "../../domain/repositories/invoices-repository";

export class InvoiceRepositoryImpl implements InvoicesRepository {


  constructor(private readonly datasource: InvoicesDatasource) {
  
  }

  getInvoices(invoicePaginationDto: InvoicePaginationDto): Promise<PaginationResult<InvoiceEntity>> {
    return this.datasource.getInvoices(invoicePaginationDto)
  }



}