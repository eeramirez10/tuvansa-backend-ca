import { CustomerPaginationDto } from "../dto/customer-pagination.dto";
import { CustomerEntity } from "../entities/customer.entity";
import { PaginationResult } from "../entities/pagination-result";

export abstract class CustomerRepository {


  abstract getList(customerPaginationDto: CustomerPaginationDto): Promise<PaginationResult<CustomerEntity>>
  abstract getById(customerId: string): Promise<CustomerEntity>


}