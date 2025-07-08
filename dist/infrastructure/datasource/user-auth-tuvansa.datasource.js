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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserAuthTuvansaDatasource = void 0;
const custom_error_1 = require("../../domain/errors/custom-error");
const client_1 = require("@prisma/client");
const bcrypt_adapter_1 = require("../adapters/bcrypt-adapter");
const prismaClient = new client_1.PrismaClient();
class UserAuthTuvansaDatasource {
    constructor(hashPassword = bcrypt_adapter_1.BcryptAdapter.hash, comparePassword = bcrypt_adapter_1.BcryptAdapter.compare) {
        this.hashPassword = hashPassword;
        this.comparePassword = comparePassword;
    }
    getOne(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prismaClient.user.findUnique({ where: { id } });
        });
    }
    getAll(authPaginationDto) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { page, pageSize } = authPaginationDto;
            const skip = (authPaginationDto.page - 1) * authPaginationDto.pageSize;
            const search = ((_a = authPaginationDto.search) === null || _a === void 0 ? void 0 : _a.toString().trim()) || undefined;
            const usersPromise = prismaClient.user.findMany({
                take: authPaginationDto.pageSize,
                skip,
                where: search ? {
                    OR: [
                        { name: { contains: search, mode: 'insensitive' } },
                        { email: { contains: search, mode: 'insensitive' } },
                        { username: { contains: search, mode: 'insensitive' } },
                        { lastname: { contains: search, mode: 'insensitive' } },
                    ]
                } : {}
            });
            const countUsersPromise = prismaClient.user.count({
                where: search ? {
                    OR: [
                        { name: { contains: search, mode: 'insensitive' } },
                        { email: { contains: search, mode: 'insensitive' } },
                        { username: { contains: search, mode: 'insensitive' } },
                        { lastname: { contains: search, mode: 'insensitive' } },
                    ]
                } : {}
            });
            const [items, total] = yield Promise.all([usersPromise, countUsersPromise]);
            const totalPages = Math.ceil(total / pageSize);
            return {
                items,
                total,
                page,
                pageSize,
                totalPages,
            };
        });
    }
    updateUser(updateUserDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = updateUserDto, data = __rest(updateUserDto, ["id"]);
            if (data.password) {
                const hashedPassword = this.hashPassword(data.password);
                data.password = hashedPassword;
            }
            const user = yield prismaClient.user.findUnique({ where: { id } });
            console.log({ user });
            if (!user)
                throw custom_error_1.CustomError.BadRequest('User not exist');
            const updateUser = yield prismaClient.user.update({
                where: { id },
                data: data
            });
            return updateUser;
        });
    }
    login(loginDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = loginDto;
            const user = yield prismaClient.user.findFirst({
                where: {
                    email,
                }
            });
            if (!user)
                throw custom_error_1.CustomError.notFound('User not found');
            if (!this.comparePassword(password, user.password))
                throw custom_error_1.CustomError.BadRequest('Incorrect Password');
            return user;
        });
    }
    create(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const { password } = dto, rest = __rest(dto, ["password"]);
            const existUser = yield prismaClient.user.findUnique({ where: { email: rest.email } });
            if (existUser) {
                throw custom_error_1.CustomError.BadRequest('User already exist');
            }
            const hashedPassword = this.hashPassword(password);
            const newUser = yield prismaClient.user.create({
                data: Object.assign(Object.assign({}, rest), { password: hashedPassword })
            });
            return newUser;
        });
    }
    checkField(checkFieldDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const { field, value } = checkFieldDto;
            const user = yield prismaClient.user.findFirst({
                where: {
                    [field]: value
                }
            });
            return Boolean(user);
        });
    }
}
exports.UserAuthTuvansaDatasource = UserAuthTuvansaDatasource;
