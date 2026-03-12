
export type Currency = "MXN" | "USD";

export interface Cost {
  average: number;          // COSTO_PROM
  last: number;
}


interface Option {

  id: string;                 // `${code}::${warehouse}`
  source: string;             // "PROSCAI"
  code: string;               // CODIGO
  ean: string;                // CLAVE
  description: string;        // DESCRIPCION
  family: string;             // FAMILIA
  stock: number;              // EXISTENCIA
  unit: string;               // UNIDAD
  purchaseCurrency: Currency; // MONEDA
  costs: Cost
  warehouseId: string
  warehouseName: string
  raw?: unknown;              // opcional para auditoría
}

export class Product {

  public readonly id: string;                 // `${code}::${warehouse}`
  public readonly source: string;             // "PROSCAI"
  public readonly code: string;               // CODIGO
  public readonly ean: string;                // CLAVE
  public readonly description: string;        // DESCRIPCION
  public readonly family: string;             // FAMILIA
  public readonly stock: number;              // EXISTENCIA
  public readonly unit: string;               // UNIDAD
  public readonly purchaseCurrency: Currency; // MONEDA
  public readonly costs: Cost
  public readonly warehouseId: string
  public readonly warehouseName: string
  public readonly raw?: unknown;

  constructor(options: Option) {
    this.id = options.id
    this.source = options.source
    this.code = options.code
    this.ean = options.ean
    this.description = options.description
    this.family = options.family
    this.stock = options.stock
    this.unit = options.unit
    this.purchaseCurrency = options.purchaseCurrency
    this.costs = options.costs
    this.warehouseId = options.warehouseId
    this.warehouseName = options.warehouseName
    this.raw = options.raw

  }


}