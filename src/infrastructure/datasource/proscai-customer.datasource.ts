import { RowDataPacket } from "mysql2";
import { CustomerDatasource } from "../../domain/datasource/customer.datasource";
import { CustomerPaginationDto } from "../../domain/dto/customer-pagination.dto";
import { CustomerEntity } from "../../domain/entities/customer.entity";
import { PaginationResult } from "../../domain/entities/pagination-result";
import { pool } from "../database/proscai.mysql-connection";
import { CustomerMapper } from "../mappers/customer-mapper";
import { ContactEntity } from "../../domain/entities/contact.entity";
import { ContactMapper } from "../mappers/contact-mapper";


export class ProscaiCustomerDatasource extends CustomerDatasource {



  async getById(customerId: string): Promise<CustomerEntity> {

    console.log({ customerId })
    const whereSQL = 'WHERE CLICOD = ?'

    const querySql = this.customersSql(whereSQL)

    console.log(`${querySql}`)

    const [rows] = await pool.query<RowDataPacket[]>(
      querySql,
      [customerId, 1, 0]
    )

    const customer = rows[0]

    const contacts = await this.getContacts(customerId)

    return CustomerMapper.jsonToEntity({ ...customer, contacts })
  }


  async getList(customerPaginationDto: CustomerPaginationDto): Promise<PaginationResult<CustomerEntity>> {
    const {
      page,
      pageSize,
      search,
      // opcional si lo usas en tu DTO; no se usa en esta consulta
    } = customerPaginationDto


    const { rows, total } = await this.querySql(customerPaginationDto)

    const items: CustomerEntity[] = await Promise.all(

      rows.map(async (row) => {


        const contacts = await this.getContacts(row.customerId)


        return CustomerMapper.jsonToEntity({ ...row, contacts })
      })

    )

    const totalPages = Math.ceil(total / pageSize)

    return {
      items,
      total,
      page,
      pageSize,
      totalPages,
    }
  }


  private async getContacts(customerId: string): Promise<ContactEntity[]> {

    const querySQL = `
      SELECT CONTKEY, CONTNOMBRE, CONTPUESTO,CONTTEL1,CONTCEL, CONTMAIL, CONTCEL FROM FCONTACTOS
      WHERE CONTKEY = ?
    `

    const [rows] = await pool.query<RowDataPacket[]>(
      querySQL,
      [customerId]
    )

    return rows.map((r) => ContactMapper.jsonToEntity({
      id: r.CONTKEY,
      name: r.CONTNOMBRE,
      jobTitle: r.CONTPUESTO,
      phone: r.CONTTEL1,
      email: r.CONTMAIL,
      mobile: r.CONTCEL
    }))

  }


  private async querySql(customerPaginationDto: CustomerPaginationDto) {

    const {
      page,
      pageSize,
      search,
      // opcional si lo usas en tu DTO; no se usa en esta consulta
    } = customerPaginationDto

    const offset = (page - 1) * pageSize

    // WHERE dinámico
    const whereClauses: string[] = ['1=1']
    const values: any[] = []

    // Búsqueda libre: código, nombre, teléfono cliente, nombre/email contacto
    if (search) {
      whereClauses.push(`
        (
          FCLI.CLICOD LIKE ? OR
          FCLI.CLINOM LIKE ? OR
          FCLI.CLITEL LIKE ? OR
          FCONTACTOS.CONTNOMBRE LIKE ? OR
          FCONTACTOS.CONTMAIL LIKE ?
        )
      `.trim())
      const like = `%${search}%`
      values.push(like, like, like, like, like)
    }



    const whereSQL = `WHERE ${whereClauses.join(' AND ')}`

    // Total (sin LIMIT) — contamos clientes únicos (CLISEQ) para evitar duplicados por JOIN con contactos
    const countSQL = `
      SELECT COUNT(*) AS total
      FROM (
        SELECT FCLI.CLISEQ
        FROM FCLI
        LEFT JOIN FAG AS AG1 ON AG1.AGTNUM = FCLI.CLIPAR1
        LEFT JOIN FCONTACTOS ON FCONTACTOS.CONTKEY = FCLI.CLICOD
        ${whereSQL}
        GROUP BY FCLI.CLISEQ
      ) AS sub
    `

    const [countRows] = await pool.query<RowDataPacket[]>(countSQL, values)
    const total = Number(countRows[0]?.total ?? 0)

    // Datos paginados

    const querySQL = this.customersSql(whereSQL)

    const [rows] = await pool.query<RowDataPacket[]>(
      querySQL,
      [...values, pageSize, offset]
    )

    return {
      rows,
      total
    }


  }

  private customersSql(whereSQL: string) {


    const querySQL = `
      SELECT
        FCLI.CLISEQ                        AS id,
        AG1.AGDESCR                        AS agent,
        FCLI.CLICOD                        AS customerId,
        FCLI.CLINOM                        AS name,
        FCLI.CLITEL                        AS mainPhone,
        FCLI.CLICONT                       AS mainContact,
        FCLI.CLIEDO                        AS state,
        FCLI.CLIPLAZO0                     AS paymentTermDays,
        FCLI.CLICREDIT                     AS creditLimit,
        FCLI.CLISACT                       AS currentBalance,



        -- Un contacto de muestra (opcional)
        FCONTACTOS.CONTNOMBRE         AS mainContactName,
        FCONTACTOS.CONTPUESTO         AS mainContactJobTitle,
        FCONTACTOS.CONTTEL1           AS mainContactPhone,
        FCONTACTOS.CONTMAIL           AS mainContactEmail,
        FCONTACTOS.CONTCEL            AS mainContactMobile

      FROM FCLI
      LEFT JOIN FAG AS AG1        ON AG1.AGTNUM  = FCLI.CLIPAR1
      LEFT JOIN FCONTACTOS        ON FCONTACTOS.CONTKEY = FCLI.CLICOD
      ${whereSQL}
      GROUP BY FCLI.CLISEQ
      ORDER BY FCLI.CLINOM
      LIMIT ? OFFSET ?
    `

    return querySQL;

  }

}