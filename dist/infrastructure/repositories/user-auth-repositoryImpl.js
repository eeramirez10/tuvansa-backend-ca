"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserAuthRepositoryImpl = void 0;
const auth_repository_1 = require("../../domain/repositories/auth.repository");
class UserAuthRepositoryImpl extends auth_repository_1.AuthRepository {
    constructor(userAuthDatasource) {
        super();
        this.userAuthDatasource = userAuthDatasource;
    }
    login(loginDto) {
        return this.userAuthDatasource.login(loginDto);
    }
    create(dto) {
        return this.userAuthDatasource.create(dto);
    }
    checkField(checkFieldDto) {
        return this.checkField(checkFieldDto);
    }
}
exports.UserAuthRepositoryImpl = UserAuthRepositoryImpl;
