import { InvoicesRepository } from '../../domain/repositories/invoices-repository';
import { InvoicePaginationDto } from '../../domain/dto/invoice-pagination.dto';


export class GetInvoicesUseCase {

  constructor(private readonly invoicesRepository: InvoicesRepository) { }

  async execute(invoicePaginationDto: InvoicePaginationDto) {

    return this.invoicesRepository.getInvoices(invoicePaginationDto)

  }
}