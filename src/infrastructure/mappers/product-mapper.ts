import { GetByEanResponseDto } from "../../domain/dto/products/get-by-ean-response.dto";
import { Product } from "../../domain/entities/product.entity";


export class ProductMapper {


  static toEntity(json: Record<string, any>): Product {


    return new Product({
      id: json.id,
      source: json.source,
      code: json.code,
      ean: json.ean,
      description: json.description,
      family: json.family,
      stock: parseFloat(json.stock),
      unit: json.unit,
      purchaseCurrency: json.purchaseCurrency,
      costs: json.costs,
      warehouseId: json.warehouseId,
      warehouseName: json.warehouseName,
      raw: json.raw,
    })

  }

  static toGetByEanResponseDto(json:Record<string, any>): GetByEanResponseDto {

    return new GetByEanResponseDto({
      id:json.id,
      code:json.code,
      ean:json.ean,
      description:json.description,
      stock: parseFloat(json.stock),
      unit:json.unit,
      currency:json.currency,
      averageCost:parseFloat(json.averageCost),
      lastCost:parseFloat(json.lastCost),
      warehouseId:json.warehouseId,
      warehouseName: json.warehouseName
    })
  }
}