export interface ErpSupplierContactDto {
  name: string;
  position: string;
  phone: string;
  extension: string;
  email: string;
  mobile: string;
  notes: string;
}

interface ErpSupplierResponseProps {
  code: string;
  name: string;
  taxId: string;
  state: string;
  creditTerms: string;
  currency: "MXN" | "USD";
  contacts: ErpSupplierContactDto[];
}

export class ErpSupplierResponseDto {
  public readonly code: string;
  public readonly name: string;
  public readonly taxId: string;
  public readonly state: string;
  public readonly creditTerms: string;
  public readonly currency: "MXN" | "USD";
  public readonly contacts: ErpSupplierContactDto[];

  constructor(props: ErpSupplierResponseProps) {
    this.code = props.code;
    this.name = props.name;
    this.taxId = props.taxId;
    this.state = props.state;
    this.creditTerms = props.creditTerms;
    this.currency = props.currency;
    this.contacts = props.contacts;
  }
}
