"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillingController = void 0;
const invoice_pagination_dto_1 = require("../../domain/dto/invoice-pagination.dto");
const get_invoices_use_case_dto_1 = require("../../use-cases/billing/get-invoices.use-case.dto");
const file_dto_1 = require("../../domain/dto/file.dto");
const get_invoice_pdf_file_use_case_dto_1 = require("../../use-cases/billing/get-invoice-pdf-file.use-case.dto");
const custom_error_1 = require("../../domain/errors/custom-error");
class BillingController {
    constructor(invoicesRepository, documentService) {
        this.invoicesRepository = invoicesRepository;
        this.documentService = documentService;
        this.getInvoices = (req, res) => {
            const user = req.user;
            console.log(user);
            const [error, invoicePaginationDto] = invoice_pagination_dto_1.InvoicePaginationDto.execute(Object.assign(Object.assign({}, req.query), user));
            if (error) {
                res.status(400).json({ error });
                return;
            }
            // console.log({ repo: this.invoicesRepository})
            new get_invoices_use_case_dto_1.GetInvoicesUseCase(this.invoicesRepository)
                .execute(invoicePaginationDto)
                .then((resp) => {
                res.json(Object.assign({}, resp));
            })
                .catch((e) => {
                console.log(e);
                res.status(500).json({ error: 'hubo un error' });
            });
        };
        this.getInvoiceFile = (req, res) => {
            const [error, fileDto] = file_dto_1.FileDto.exec(Object.assign({}, req.body));
            if (error) {
                res.status(400).json({ error });
                return;
            }
            console.log(fileDto);
            const invoicesPath = `/facturas-proscai/${fileDto === null || fileDto === void 0 ? void 0 : fileDto.filename}`;
            new get_invoice_pdf_file_use_case_dto_1.GetInvoicePdfFileUseCase(this.documentService)
                .execute(invoicesPath)
                .then(resp => {
                res
                    .status(200)
                    .header('Content-Type', `application/${fileDto.type}`)
                    .header("Content-Disposition", `attachment; filename="${fileDto.filename}"`)
                    .send(resp);
            })
                .catch(error => {
                if (error instanceof custom_error_1.CustomError) {
                    res.status(error.statusCode).json({ error: error.message });
                }
            });
        };
    }
}
exports.BillingController = BillingController;
