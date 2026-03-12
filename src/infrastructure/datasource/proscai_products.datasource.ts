import { ProductsDatasource } from "../../domain/datasource/products.datasource";
import { GetByEanAndBranchRequestDto } from "../../domain/dto/products/get-by-ean-and-branch-request.dto";
import { GetByEanResponseDto } from "../../domain/dto/products/get-by-ean-response.dto";
import { pool } from "../database/proscai.mysql-connection";
import { ProductMapper } from "../mappers/product-mapper";


export class ProscaiProductsRepository implements ProductsDatasource {


  async findByEanAndBranch(request: GetByEanAndBranchRequestDto): Promise<GetByEanResponseDto[]> {

    const { ean, branchId } = request

    console.log({ request })

    const productsSql = `
    SELECT
  almseq as id,
  ICOD AS CODIGO,
  IEAN AS CLAVE,
  I2DESCR AS DESCRIPCION,
  FAMB.FAMDESCR AS FAMILIA,
  ALMNUM AS ALMACEN_ID,
  CASE ALMNUM
    WHEN '01' THEN 'MEXICO'
    WHEN '02' THEN 'MONTERREY'
    WHEN '03' THEN 'VERACRUZ'
    WHEN '04' THEN 'MEXICALI'
    WHEN '05' THEN 'QUERETARO'
    WHEN '06' THEN 'CANCUN'
    ELSE 'DESCONOCIDO'
    END AS ALMACEN_NOMBRE,
    ALMCANT AS EXISTENCIA,
    IUM AS UNIDAD,
    CASE WHEN IMONEDA1 = '1' THEN 'MXN' ELSE 'USD' END AS MONEDA,
    ILISTA4 AS COSTO_PROM,
    ILISTA5 AS COSTO_ULTI
    FROM FALM
    LEFT JOIN FINV ON FINV.ISEQ = FALM.ISEQ
    LEFT JOIN FINV2 ON FINV2.I2KEY = FINV.ISEQ
    LEFT JOIN FFAM AS FAMB ON FAMB.FAMTNUM = FINV.IFAMB
    WHERE IEAN LIKE ? AND
    ITIPO = 1 AND ALMNUM = ?
    limit 10
    
    `

    const [rows] = await pool.query<any[]>(productsSql, [`%${ean}%`, branchId])


    return rows.map(row => ProductMapper.toGetByEanResponseDto({
      id: row.id,
      code: row.CODIGO,
      ean: row.CLAVE,
      description: row.DESCRIPCION,
      stock: row.EXISTENCIA,
      unit: row.UNIDAD,
      currency: row.MONEDA,
      averageCost: row.COSTO_PROM,
      lastCost: row.COSTO_ULTI,
      warehouseId: row.ALMACEN_ID,
      warehouseName: row.ALMACEN_NOMBRE,

    }))
  }






}