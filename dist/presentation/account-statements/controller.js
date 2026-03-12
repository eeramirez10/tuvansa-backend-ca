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
exports.AccountStetementsController = void 0;
const account_statement_pagination_dto_1 = require("../../domain/dto/account-statement/account-statement-pagination.dto");
class AccountStetementsController {
    constructor(accountStatementRepository, emailService) {
        this.accountStatementRepository = accountStatementRepository;
        this.emailService = emailService;
        this.getAll = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const [error, dto] = account_statement_pagination_dto_1.AccountStatementPaginationDto.execute(Object.assign({}, req.query));
            if (error) {
                res.status(400).json({ error });
                return;
            }
            try {
                const data = yield this.accountStatementRepository.getAll(dto);
                res.json(Object.assign({}, data));
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ error: 'Server Error' });
            }
        });
        this.sendAccountStatements = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            try {
                const data = yield this.emailService.sendEmail({
                    to: body.to,
                    subject: body.subject,
                    htmlBody: body.htmlContent
                });
                res.json(data);
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ error: 'Server Error' });
            }
        });
    }
}
exports.AccountStetementsController = AccountStetementsController;
