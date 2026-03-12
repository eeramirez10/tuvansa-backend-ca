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
exports.ProductsController = void 0;
const get_by_ean_and_branch_request_dto_1 = require("../../domain/dto/products/get-by-ean-and-branch-request.dto");
class ProductsController {
    constructor(repository) {
        this.repository = repository;
        this.getProductByEanAndBranch = (req, res) => __awaiter(this, void 0, void 0, function* () {
            console.log(req.params);
            const [error, dto] = get_by_ean_and_branch_request_dto_1.GetByEanAndBranchRequestDto.execute(Object.assign({}, req.params));
            if (error) {
                res.status(400).json({ error });
                return;
            }
            this.repository.findByEanAndBranch(dto)
                .then((products) => {
                res.json(products);
            })
                .catch((error) => {
                console.log(error);
                res.status(500).json({
                    error: 'Internal error'
                });
            });
        });
    }
}
exports.ProductsController = ProductsController;
