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
const get_product_availability_request_dto_1 = require("../../domain/dto/products/get-product-availability-request.dto");
const get_products_availability_batch_request_dto_1 = require("../../domain/dto/products/get-products-availability-batch-request.dto");
const get_product_by_ean_and_branch_use_case_1 = require("../../use-cases/products/get-product-by-ean-and-branch.use-case");
const get_product_availability_use_case_1 = require("../../use-cases/products/get-product-availability.use-case");
const get_products_availability_batch_use_case_1 = require("../../use-cases/products/get-products-availability-batch.use-case");
const search_mexico_products_request_dto_1 = require("../../domain/dto/products/search-mexico-products-request.dto");
const search_mexico_products_use_case_1 = require("../../use-cases/products/search-mexico-products.use-case");
const get_mexico_product_by_code_use_case_1 = require("../../use-cases/products/get-mexico-product-by-code.use-case");
const search_products_by_warehouses_request_dto_1 = require("../../domain/dto/products/search-products-by-warehouses-request.dto");
const search_products_by_warehouses_use_case_1 = require("../../use-cases/products/search-products-by-warehouses.use-case");
class ProductsController {
    constructor(repository) {
        this.searchByWarehouses = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const [error, dto] = search_products_by_warehouses_request_dto_1.SearchProductsByWarehousesRequestDto.execute(req.body);
            if (error) {
                res.status(400).json({ error });
                return;
            }
            try {
                const items = yield this.searchProductsByWarehousesUseCase.execute(dto.term, dto.warehouseCodes);
                res.status(200).json({
                    query: dto.term,
                    warehouseCodes: dto.warehouseCodes,
                    itemsCount: items.length,
                    items,
                });
            }
            catch (cause) {
                console.error("search_products_by_warehouses_failed", cause);
                res.status(500).json({ error: "Internal error" });
            }
        });
        this.searchMexicoProducts = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const [error, dto] = search_mexico_products_request_dto_1.SearchMexicoProductsRequestDto.execute(req.query.query);
            if (error) {
                res.status(400).json({ error });
                return;
            }
            try {
                res.status(200).json(yield this.searchMexicoProductsUseCase.execute(dto.term));
            }
            catch (cause) {
                console.error("search_mexico_products_failed", cause);
                res.status(500).json({ error: "Internal error" });
            }
        });
        this.getMexicoProductByCode = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const [error, dto] = search_mexico_products_request_dto_1.SearchMexicoProductsRequestDto.execute(req.params.code);
            if (error) {
                res.status(400).json({ error });
                return;
            }
            try {
                const product = yield this.getMexicoProductByCodeUseCase.execute(dto.term);
                if (!product) {
                    res.status(404).json({ error: "Product not found in Mexico branch" });
                    return;
                }
                res.status(200).json(product);
            }
            catch (cause) {
                console.error("get_mexico_product_by_code_failed", cause);
                res.status(500).json({ error: "Internal error" });
            }
        });
        this.getProductByEanAndBranch = (req, res) => __awaiter(this, void 0, void 0, function* () {
            console.log(req.params);
            const [error, dto] = get_by_ean_and_branch_request_dto_1.GetByEanAndBranchRequestDto.execute(Object.assign({}, req.params));
            if (error) {
                res.status(400).json({ error });
                return;
            }
            this.getByEanAndBranchUseCase.execute(dto)
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
        this.getAvailability = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const [error, dto] = get_product_availability_request_dto_1.GetProductAvailabilityRequestDto.execute(req.params.ean);
            if (error) {
                res.status(400).json({ error });
                return;
            }
            try {
                const product = yield this.getProductAvailabilityUseCase.execute(dto.ean);
                if (!product) {
                    res.status(404).json({ error: "Product not found" });
                    return;
                }
                res.status(200).json(product);
            }
            catch (error) {
                console.error("get_product_availability_failed", error);
                res.status(500).json({ error: "Internal error" });
            }
        });
        this.getAvailabilityBatch = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const [error, dto] = get_products_availability_batch_request_dto_1.GetProductsAvailabilityBatchRequestDto.execute(req.body);
            if (error) {
                res.status(400).json({ error });
                return;
            }
            try {
                const items = yield this.getProductsAvailabilityBatchUseCase.execute(dto.eans, dto.warehouseCodes);
                res.status(200).json({
                    itemsCount: items.length,
                    requestedCount: dto.eans.length,
                    missingEans: dto.eans.filter((ean) => !items.some((item) => item.ean === ean)),
                    items,
                });
            }
            catch (error) {
                console.error("get_products_availability_batch_failed", error);
                res.status(500).json({ error: "Internal error" });
            }
        });
        this.getByEanAndBranchUseCase = new get_product_by_ean_and_branch_use_case_1.GetErpProductByEanAndBranchUseCase(repository);
        this.getProductAvailabilityUseCase = new get_product_availability_use_case_1.GetProductAvailabilityUseCase(repository);
        this.getProductsAvailabilityBatchUseCase = new get_products_availability_batch_use_case_1.GetProductsAvailabilityBatchUseCase(repository);
        this.searchMexicoProductsUseCase = new search_mexico_products_use_case_1.SearchMexicoProductsUseCase(repository);
        this.getMexicoProductByCodeUseCase = new get_mexico_product_by_code_use_case_1.GetMexicoProductByCodeUseCase(repository);
        this.searchProductsByWarehousesUseCase = new search_products_by_warehouses_use_case_1.SearchProductsByWarehousesUseCase(repository);
    }
}
exports.ProductsController = ProductsController;
