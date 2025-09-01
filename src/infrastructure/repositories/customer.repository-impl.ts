import { CustomerDatasource } from "../../domain/datasource/customer.datasource";
import { CustomerPaginationDto } from "../../domain/dto/customer-pagination.dto";
import { CustomerEntity } from "../../domain/entities/customer.entity";
import { PaginationResult } from "../../domain/entities/pagination-result";
import { CustomerRepository } from "../../domain/repositories/customer.repository";

export class CustomerRepositoryImpl implements CustomerRepository {

  constructor(private readonly customerDatasource: CustomerDatasource) { }


  getList(customerPaginationDto: CustomerPaginationDto): Promise<PaginationResult<CustomerEntity>> {
    return this.customerDatasource.getList(customerPaginationDto);
  }

  getById(customerId: string): Promise<CustomerEntity> {
    return this.customerDatasource.getById(customerId)
  }


}