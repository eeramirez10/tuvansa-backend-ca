import { Currency } from "../../entities/product.entity";



interface GetByEanResponseDtoProps {
  id: string;
  code: string;
  ean: string;
  description: string;
  stock: number;
  unit: string;
  currency: Currency;
  saleCurrency: Currency;
  costCurrency: "MXN";
  averageCost: number;
  lastCost: number;
  averageCostMxn: number;
  lastCostMxn: number;
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
  public readonly saleCurrency: Currency
  public readonly costCurrency: "MXN"
  public readonly averageCost: number
  public readonly lastCost: number
  public readonly averageCostMxn: number
  public readonly lastCostMxn: number
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
    this.saleCurrency = option.saleCurrency
    this.costCurrency = option.costCurrency
    this.averageCost = option.averageCost
    this.lastCost = option.lastCost
    this.averageCostMxn = option.averageCostMxn
    this.lastCostMxn = option.lastCostMxn
    this.warehouseId = option.warehouseId
    this.warehouseName = option.warehouseName
  }


}
