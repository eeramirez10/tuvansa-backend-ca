import { BranchOffice, BranchOfficeDatasource } from "../../domain/datasource/branch-office.datasource";
import { pool } from "../database/proscai.mysql-connection";

export class ProscaiBranchOfficeDatasource implements BranchOfficeDatasource {


  async getByEan(ean: string): Promise<BranchOffice[]> {

    const almnumName = {
      '01': 'MEXICO',
      '02': 'MONTERREY',
      '03': 'VERACRUZ',
      '04': 'MEXICALI',
      '05': 'QUERETARO',
      '06': 'CANCUN',
      '07': 'CABOS',
      '13':'Resguardo Mex - Ver',
      '22':'Resguardo Mty',
      '97':'Transito VERACRUZ',
      '99':'Transito Mexico'
    } as any



    const params: Array<string | number> = [ean];

    const whereClauses: string[] = [
      'IEAN = ?',
      'ALMNUM IS NOT NULL'
    ];


    // 3. Assemble full SQL
    const sql = `

    SELECT finv.iseq as id, ALMNUM as name,
		
          SUM(ALMCANT) AS stock,
          ILISTA4 AS cost
          FROM FINV
          LEFT JOIN FALM ON FALM.ISEQ=FINV.ISEQ
          LEFT JOIN FUNIDAD ON FUNIDAD.UCOD=FINV.IUM
          LEFT JOIN FINV2 ON FINV2.I2KEY=FINV.ISEQ
			    ${whereClauses.length ? 'WHERE ' + whereClauses.join(' AND ') : ''}
          GROUP BY ICOD
          order by ICOD;
          
        `;

    const [rows] = await pool.execute<any[]>(sql, params);

    console.log(rows)
    return rows.map((r) => ({

      ...r,
      id: `${r.id}`,
      name: almnumName[r.name] ?? `Almacen ${r.name}`,

    }))
  }


}