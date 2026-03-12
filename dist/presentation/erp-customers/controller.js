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
exports.ErpCustomersController = void 0;
const search_erp_customers_request_dto_1 = require("../../domain/dto/erp-customers/search-erp-customers-request.dto");
const search_erp_customers_use_case_1 = require("../../use-cases/erp-customers/search-erp-customers.use-case");
class ErpCustomersController {
    constructor(repository) {
        this.repository = repository;
        this.search = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const [error, dto] = search_erp_customers_request_dto_1.SearchErpCustomersRequestDto.execute(req.query);
            if (error) {
                res.status(400).json({ error });
                return;
            }
            try {
                const customers = yield new search_erp_customers_use_case_1.SearchErpCustomersUseCase(this.repository).execute(dto);
                res.json(customers);
            }
            catch (err) {
                console.log(err);
                res.status(500).json({ error: 'Internal error' });
            }
        });
    }
}
exports.ErpCustomersController = ErpCustomersController;
