"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErpSuppliersController = void 0;
const search_erp_suppliers_request_dto_1 = require("../../domain/dto/erp-suppliers/search-erp-suppliers-request.dto");
const get_erp_supplier_by_code_use_case_1 = require("../../use-cases/erp-suppliers/get-erp-supplier-by-code.use-case");
const search_erp_suppliers_use_case_1 = require("../../use-cases/erp-suppliers/search-erp-suppliers.use-case");
class ErpSuppliersController {
    constructor(repository) {
        this.repository = repository;
        this.search = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const [error, dto] = search_erp_suppliers_request_dto_1.SearchErpSuppliersRequestDto.execute(req.query);
            if (error)
                return void res.status(400).json({ error });
            try {
                res.status(200).json(yield new search_erp_suppliers_use_case_1.SearchErpSuppliersUseCase(this.repository).execute(dto));
            }
            catch (cause) {
                console.error("search_erp_suppliers_failed", cause);
                res.status(500).json({ error: "Internal error" });
            }
        });
        this.getByCode = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const code = typeof req.params.code === "string" ? req.params.code.trim().toUpperCase() : "";
            if (!code)
                return void res.status(400).json({ error: "Supplier code is required" });
            try {
                const supplier = yield new get_erp_supplier_by_code_use_case_1.GetErpSupplierByCodeUseCase(this.repository).execute(code);
                if (!supplier)
                    return void res.status(404).json({ error: "Supplier not found" });
                res.status(200).json(supplier);
            }
            catch (cause) {
                console.error("get_erp_supplier_failed", cause);
                res.status(500).json({ error: "Internal error" });
            }
        });
    }
}
exports.ErpSuppliersController = ErpSuppliersController;
