import { InvoicePaginationDto } from "../dto/invoice-pagination.dto";
import { InvoiceEntity } from "../entities/invoice-entity";
import { PaginationResult } from "../entities/pagination-result";


export abstract class InvoicesRepository {

  abstract getInvoices(invoicePaginationDto: InvoicePaginationDto): Promise<PaginationResult<InvoiceEntity>>


}