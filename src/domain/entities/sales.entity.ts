
export interface SalesRecord {
  branch: string;         // e.g. "05 QUERETARO"
  month: string;          // e.g. "07 JULIO"
  type: string;           // e.g. "FI"
  client: string;         // e.g. "PROYECTOS TECNOLOGIA Y MATERIALES, SA DE CV"
  monthNumber: number;    // e.g. 7
  year: number;           // e.g. 2025
  date: string;           // e.g. "2025-07-01" (ISO format)
  document: string;       // e.g. "FI0004896"
  code: string;           // e.g. "05121193"
  ean: string;            // e.g. "SNLE21/2X1F922E"
  description: string;    // e.g. "SNAP-LET VICTAULIC FIGURA 922 DE 064 X 025 MM..."
  family: string;         // e.g. "VICTAULIC"
  agent: string;          // e.g. "MIRIAM"
  quantity: number;       // e.g. 20.0
  salesAmount: number;    // e.g. 3491.7004
  costAmount: number;     // e.g. 2378.38
  profit: number;         // e.g. 1113.3204
  percentage: number;     // e.g. 31.884763079902
}



export class SalesEntity {
  readonly branch: string;
  readonly month: string;
  readonly type: string;
  readonly client: string;
  readonly monthNumber: number;
  readonly year: number;
  readonly date: string;
  readonly document: string;
  readonly code: string;
  readonly ean: string;
  readonly description: string;
  readonly family: string;
  readonly agent: string;
  readonly quantity: number;
  readonly salesAmount: number;
  readonly costAmount: number;
  readonly profit: number;
  readonly percentage: number;

  constructor(options: SalesRecord) {
    this.branch = options.branch
    this.month = options.month
    this.type = options.type
    this.client = options.client
    this.monthNumber = options.monthNumber
    this.year = options.year
    this.date = options.date
    this.document = options.document
    this.code = options.code
    this.ean = options.ean
    this.description = options.description
    this.family = options.family
    this.agent = options.agent
    this.quantity = options.quantity
    this.salesAmount = options.salesAmount
    this.costAmount = options.costAmount
    this.profit = options.profit
    this.percentage = options.percentage
  }

}