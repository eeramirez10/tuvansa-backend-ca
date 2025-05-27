"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const login_user_dto_1 = require("../../domain/dto/auth/login-user.dto");
const login_user_use_case_1 = require("../../use-cases/auth/login-user.use-case");
const custom_error_1 = require("../../domain/errors/custom-error");
const create_user_dto_1 = require("../../domain/dto/auth/create-user.dto");
const register_user_use_case_1 = require("../../use-cases/auth/register-user.use-case");
const renew_token_use_case_1 = require("../../use-cases/auth/renew-token.use-case");
class AuthController {
    constructor(authRepository) {
        this.authRepository = authRepository;
        this.handleError = (error, res) => {
            if (error instanceof custom_error_1.CustomError) {
                console.log(error);
                res.status(error.statusCode).json({ error: error.message });
                return;
            }
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
    }
}
exports.AuthController = AuthController;
