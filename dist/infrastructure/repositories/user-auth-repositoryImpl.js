"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserAuthRepositoryImpl = void 0;
const auth_repository_1 = require("../../domain/repositories/auth.repository");
class UserAuthRepositoryImpl extends auth_repository_1.AuthRepository {
    getOne(id) {
        return this.userAuthDatasource.getOne(id);
    }
    getAll(authPaginationDto) {
        return this.userAuthDatasource.getAll(authPaginationDto);
    }
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
    updateUser(updateUserDto) {
        return this.userAuthDatasource.updateUser(updateUserDto);
    }
}
exports.UserAuthRepositoryImpl = UserAuthRepositoryImpl;
