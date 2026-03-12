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
exports.BranchOfficeController = void 0;
const find_by_ean_dto_1 = require("../../domain/dto/branch-office/find-by-ean.dto");
const get_branchs_by_ean_use_case_1 = require("../../use-cases/branch-office/get-branchs-by-ean.use-case");
class BranchOfficeController {
    constructor(branchOfficeRepository) {
        this.branchOfficeRepository = branchOfficeRepository;
        this.getByEan = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const ean = encodeURIComponent(req.params.ean);
            const [error, eanDto] = find_by_ean_dto_1.FindByEanDto.execute(ean);
            if (error) {
                res.status(400).json({ error });
                return;
            }
            const branchOffices = yield new get_branchs_by_ean_use_case_1.GetBranchsByEanUseCase(this.branchOfficeRepository).execute(eanDto);
            res.json(branchOffices);
        });
    }
}
exports.BranchOfficeController = BranchOfficeController;
