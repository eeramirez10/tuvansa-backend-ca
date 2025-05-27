

export interface InvoiceRecord {
  client: string;
  rfc: string;             // CONCAT(CLICOD, '  ', CLINOM)
  invoiceNumber: string;      // DNUM
  reference: string;          // DREFERELLOS
  invoiceDate: Date;          // DFECHA
  dueDate: Date;              // DVENCE
  orderDate: Date;            // DFECHAPEDIDO
  grossAmount: number;        // DBRUTO
  vatAmount: number;          // DIVA
  totalAmount: number;        // DCANTF
  balance: number;            // DCANT
  exchangeRate: number;       // DTIPOC2
  statusCfd: string;          // DSTATUSCFD
  currency: 'PESOS' | 'DOLARES'; // IF(DMONEDA=1,'PESOS','DOLARES')
}

export class InvoiceEntity {

  readonly client: string;
  readonly rfc: string;             // CONCAT(CLICOD, '  ', CLINOM)
  readonly invoiceNumber: string;      // DNUM
  readonly reference: string;          // DREFERELLOS
  readonly invoiceDate: Date;          // DFECHA
  readonly dueDate: Date;              // DVENCE
  readonly orderDate: Date;            // DFECHAPEDIDO
  readonly grossAmount: number;        // DBRUTO
  readonly vatAmount: number;          // DIVA
  readonly totalAmount: number;        // DCANTF
  readonly balance: number;            // DCANT
  readonly exchangeRate: number;       // DTIPOC2
  readonly statusCfd: string;          // DSTATUSCFD
  readonly currency: 'PESOS' | 'DOLARES'; // IF(DMONEDA=1,'PESOS','DOLARES')

  constructor(invoice: InvoiceRecord) {
    this.client = invoice.client
    this.rfc = invoice.rfc
    this.invoiceNumber = invoice.invoiceNumber
    this.reference = invoice.reference
    this.invoiceDate = invoice.invoiceDate
    this.dueDate = invoice.dueDate
    this.orderDate = invoice.orderDate
    this.grossAmount = invoice.grossAmount
    this.vatAmount = invoice.vatAmount
    this.totalAmount = invoice.totalAmount
    this.balance = invoice.balance
    this.exchangeRate = invoice.exchangeRate
    this.statusCfd = invoice.statusCfd
    this.currency = invoice.currency
  }
}

