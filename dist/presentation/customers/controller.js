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
exports.CustomerController = void 0;
const customer_pagination_dto_1 = require("../../domain/dto/customer-pagination.dto");
class CustomerController {
    constructor(customerRepository) {
        this.customerRepository = customerRepository;
        this.getCustomers = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const [error, customerPaginationDto] = customer_pagination_dto_1.CustomerPaginationDto.execute(Object.assign({}, req.query));
            if (error) {
                res.status(400).json({ error });
                return;
            }
            try {
                const customers = yield this.customerRepository.getList(customerPaginationDto);
                res.json(Object.assign({}, customers));
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ error: 'Hubo un error' });
            }
            // console.log({ repo: this.invoicesRepository})
        });
        this.getById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const customerId = req.params.customerId || undefined;
            if (!customerId) {
                res.status(400).json({ error: 'customerId is required' });
                return;
            }
            try {
                const customer = yield this.customerRepository.getById(customerId);
                res.json(Object.assign({}, customer));
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ error: 'Hubo un error' });
            }
            // console.log({ repo: this.invoicesRepository})
        });
    }
}
exports.CustomerController = CustomerController;
