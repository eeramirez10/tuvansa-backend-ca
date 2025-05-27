"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TuvansaDocumentService = void 0;
const document_service_1 = require("../../domain/services/document-service");
class TuvansaDocumentService extends document_service_1.DocumentService {
    constructor(storage) {
        super();
        this.storage = storage;
    }
    getPdf(remotePath) {
        return this.storage.download(remotePath);
    }
    getXml(remotePath) {
        return this.storage.download(remotePath);
    }
}
exports.TuvansaDocumentService = TuvansaDocumentService;
