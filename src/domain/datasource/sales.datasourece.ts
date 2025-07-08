import { SalesDto, SalesFilterDtoInput } from "../dto/sales/sales.dto";
import { SalesEntity } from "../entities/sales.entity";



export abstract class SalesDatasource {


  abstract getSales(filters: SalesDto): Promise<SalesEntity[]>

}