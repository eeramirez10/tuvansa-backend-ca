"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalesController = void 0;
const sales_dto_1 = require("../../domain/dto/sales/sales.dto");
class SalesController {
    constructor(salesRepository) {
        this.salesRepository = salesRepository;
        this.getSales = (req, res) => {
            const [error, salesDto] = sales_dto_1.SalesDto.execute(Object.assign({}, req.query));
            if (error) {
                res.status(400).json({ error });
                return;
            }
            this.salesRepository.getSales(salesDto)
                .then(resp => {
                res.json(resp);
            })
                .catch((error) => {
                res.status(500).json(error);
            });
        };
    }
}
exports.SalesController = SalesController;
