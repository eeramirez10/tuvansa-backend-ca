import { SalesDto } from "../dto/sales/sales.dto";
import { SalesEntity } from "../entities/sales.entity";

export abstract class SalesRepository {

  abstract getSales(filters: SalesDto): Promise<SalesEntity[]>
}