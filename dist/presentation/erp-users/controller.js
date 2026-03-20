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
exports.ErpUsersController = void 0;
const search_erp_users_query_dto_1 = require("../../domain/dto/erp-users/search-erp-users-query.dto");
const get_erp_user_by_code_params_dto_1 = require("../../domain/dto/erp-users/get-erp-user-by-code-params.dto");
class ErpUsersController {
    constructor(searchErpUsersUseCase, getErpUserByCodeUseCase) {
        this.searchErpUsersUseCase = searchErpUsersUseCase;
        this.getErpUserByCodeUseCase = getErpUserByCodeUseCase;
        this.search = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const [error, dto] = search_erp_users_query_dto_1.SearchErpUsersQueryDto.create(req.query);
            if (error)
                return void res.status(400).json({ error });
            try {
                this.searchErpUsersUseCase.execute(dto)
                    .then((items) => {
                    res.status(200).json({ items });
                });
            }
            catch (err) {
                const message = err instanceof Error ? err.message : "Unexpected error while searching ERP users.";
                res.status(500).json({ error: message });
            }
        });
        this.getByCode = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const [error, dto] = get_erp_user_by_code_params_dto_1.GetErpUserByCodeParamsDto.create(req.params);
            if (error)
                return void res.status(400).json({ error });
            try {
                const user = yield this.getErpUserByCodeUseCase.execute(dto);
                if (!user)
                    return void res.status(404).json({ error: "ERP user not found." });
                res.status(200).json(user);
            }
            catch (err) {
                const message = err instanceof Error ? err.message : "Unexpected error while getting ERP user.";
                res.status(500).json({ error: message });
            }
        });
    }
}
exports.ErpUsersController = ErpUsersController;
