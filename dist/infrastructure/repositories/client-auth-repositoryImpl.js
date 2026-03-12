"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientAuthRepositoryImpl = void 0;
const auth_repository_1 = require("../../domain/repositories/auth.repository");
class ClientAuthRepositoryImpl extends auth_repository_1.AuthRepository {
    getAll(authPaginationDto) {
        throw new Error("Method not implemented.");
    }
    getOne(id) {
        throw new Error("Method not implemented.");
    }
    updateUser(updateUserDto) {
        throw new Error("Method not implemented.");
    }
    constructor(clientAuthDatasource) {
        super();
        this.clientAuthDatasource = clientAuthDatasource;
    }
    login(loginDto) {
        return this.clientAuthDatasource.login(loginDto);
    }
    create(dto) {
        return this.clientAuthDatasource.create(dto);
    }
    checkField(checkFieldDto) {
        return this.clientAuthDatasource.checkField(checkFieldDto);
    }
}
exports.ClientAuthRepositoryImpl = ClientAuthRepositoryImpl;
