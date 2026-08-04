"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErpSupplierResponseDto = void 0;
class ErpSupplierResponseDto {
    constructor(props) {
        this.code = props.code;
        this.name = props.name;
        this.taxId = props.taxId;
        this.state = props.state;
        this.creditTerms = props.creditTerms;
        this.currency = props.currency;
        this.contacts = props.contacts;
    }
}
exports.ErpSupplierResponseDto = ErpSupplierResponseDto;
