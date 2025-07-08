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
exports.AuthController = void 0;
const login_user_dto_1 = require("../../domain/dto/auth/login-user.dto");
const login_user_use_case_1 = require("../../use-cases/auth/login-user.use-case");
const custom_error_1 = require("../../domain/errors/custom-error");
const create_user_dto_1 = require("../../domain/dto/auth/create-user.dto");
const register_user_use_case_1 = require("../../use-cases/auth/register-user.use-case");
const renew_token_use_case_1 = require("../../use-cases/auth/renew-token.use-case");
const update_user_dto_1 = require("../../domain/dto/auth/update-user.dto");
const auth_pagination_dto_1 = require("../../domain/dto/auth/auth-pagination.dto");
class AuthController {
    constructor(authRepository) {
        this.authRepository = authRepository;
        this.handleError = (error, res) => {
            if (error instanceof custom_error_1.CustomError) {
                console.log(error);
                res.status(error.statusCode).json({ error: error.message });
                return;
            }
            console.log(error);
            res.status(500).json({ error: 'Error desconocido' });
        };
        this.loginUser = (req, res) => {
            const [error, loginDto] = login_user_dto_1.LoginDto.execute(Object.assign({}, req.body));
            if (error) {
                res.status(400).json({ error });
                return;
            }
            new login_user_use_case_1.LoginUserUseCase(this.authRepository)
                .execute(loginDto)
                .then((user) => {
                res.json(user);
            })
                .catch((e) => {
                // res.status(500).json({ error: 'Valio verga'})
                this.handleError(e, res);
            });
        };
        this.createUser = (req, res) => {
            const [error, createUserDto] = create_user_dto_1.CreateUserDto.execute(Object.assign({}, req.body));
            if (error) {
                res.status(400).json({ error });
                return;
            }
            new register_user_use_case_1.RegisterUserUseCase(this.authRepository)
                .execute(createUserDto)
                .then((user) => {
                res.json(user);
            })
                .catch(e => {
                console.log(e);
                this.handleError(e, res);
            });
        };
        this.renewToken = (req, res) => {
            const user = req.user;
            new renew_token_use_case_1.RenewTokenUseCase()
                .execute(user)
                .then((data) => {
                res.json(data);
            })
                .catch((error) => {
                console.log(error['message']);
                this.handleError(error, res);
            });
        };
        this.updateUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const body = req.body;
            const [error, updateUserDto] = update_user_dto_1.UpdateUserDto.execute(Object.assign(Object.assign({}, body), { id }));
            if (error) {
                res.status(400).json({ error });
                return;
            }
            try {
                const user = yield this.authRepository.updateUser(updateUserDto);
                res.json(user);
                return;
            }
            catch (error) {
                console.log(error);
                this.handleError(error, res);
            }
        });
        this.getUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            try {
                const user = yield this.authRepository.getOne(id);
                res.json(user);
            }
            catch (error) {
                console.log(error);
                this.handleError(error, res);
            }
        });
        this.getUsers = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const [error, authPaginationDto] = auth_pagination_dto_1.AuthPaginationDto.execute(Object.assign({}, req.query));
            if (error) {
                res.status(400).json({ error });
                return;
            }
            try {
                const user = yield this.authRepository.getAll(Object.assign({}, authPaginationDto));
                res.json(user);
            }
            catch (error) {
                console.log(error);
                this.handleError(error, res);
            }
        });
    }
}
exports.AuthController = AuthController;
