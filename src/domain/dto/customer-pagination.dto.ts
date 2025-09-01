import { PaginationDto, PaginationOptions } from "./pagination.dto";


interface CustomerOptions extends PaginationOptions {

}

export class CustomerPaginationDto extends PaginationDto {

 
  constructor(data: CustomerOptions) {
    super(data);
    
  }

  static execute(options: { [key: string]: any; }): [string?, CustomerPaginationDto?] {

    const [err, paginationDto] = PaginationDto.execute(options);
    if (err) return [err]

    

    return [, new CustomerPaginationDto({ ...paginationDto! })]
  }


}