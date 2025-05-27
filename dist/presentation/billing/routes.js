"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillingRoutes = void 0;
const express_1 = require("express");
const controller_1 = require("./controller");
const ProscaiInvoicesDatasourceImpl_1 = require("../../infrastructure/datasource/ProscaiInvoicesDatasourceImpl");
const invoice_repositoryImpl_1 = require("../../infrastructure/repositories/invoice-repositoryImpl");
const tuvansa_document_service_1 = require("../../infrastructure/services/tuvansa-document.service");
const basic_ftp_storage_adapter_1 = require("../../infrastructure/adapters/basic-ftp-storage.adapter");
class BillingRoutes {
    static routes() {
        const router = (0, express_1.Router)();
        const datasource = new ProscaiInvoicesDatasourceImpl_1.ProscaiInvoicesDatasourceImpl();
        const repository = new invoice_repositoryImpl_1.InvoiceRepositoryImpl(datasource);
        const ftpAdapter = new basic_ftp_storage_adapter_1.BasicFtpStorageAdapter();
        const controller = new controller_1.BillingController(repository, new tuvansa_document_service_1.TuvansaDocumentService(ftpAdapter));
        router.get('/invoices', controller.getInvoices);
        router.post('/invoices/file', controller.getInvoiceFile);
        return router;
    }
}
exports.BillingRoutes = BillingRoutes;
