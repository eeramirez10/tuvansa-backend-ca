import { Currency } from "../../entities/product.entity";



interface GetByEanResponseDtoProps {
  id: string;
  code: string;
  ean: string;
  description: string;
  stock: number;
  unit: string;
  currency: Currency;
  averageCost: number;
  lastCost: number;
  warehouseId: string
  warehouseName: string
}

export class GetByEanResponseDto {
  public readonly id: string
  public readonly code: string
  public readonly ean: string
  public readonly description: string
  public readonly stock: number
  public readonly unit: string
  public readonly currency: Currency
  public readonly averageCost: number
  public readonly lastCost: number
  public readonly warehouseId: string
  public readonly warehouseName: string

  constructor(option: GetByEanResponseDtoProps) {
    this.id = option.id
    this.code = option.code
    this.ean = option.ean
    this.description = option.description
    this.stock = option.stock
    this.unit = option.unit
    this.currency = option.currency
    this.averageCost = option.averageCost
    this.lastCost = option.lastCost
    this.warehouseId = option.warehouseId
    this.warehouseName = option.warehouseName
  }


}