"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountStatementRepositoryImpl = void 0;
class AccountStatementRepositoryImpl {
    constructor(accountStatementDatasource) {
        this.accountStatementDatasource = accountStatementDatasource;
    }
    getAll(asDTO) {
        return this.accountStatementDatasource.getAll(asDTO);
    }
    getById(id) {
        return this.accountStatementDatasource.getById(id);
    }
    getByClientId(clientId) {
        return this.getByClientId(clientId);
    }
}
exports.AccountStatementRepositoryImpl = AccountStatementRepositoryImpl;
