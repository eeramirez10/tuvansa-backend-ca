"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateClientDto = void 0;
const validators_1 = require("../../../config/utils/validators");
const create_auth_dto_1 = require("../auth/create-auth.dto");
class CreateClientDto extends create_auth_dto_1.CreateAuthDto {
    constructor(options) {
        super(options);
        this.name = options.name;
        this.email = options.email;
        this.rfc = options.rfc;
        this.businessName = options.businessName;
        this.taxRegime = options.taxRegime;
        this.password = options.password;
    }
    static execute(object) {
        const { name, email, rfc, businessName, taxRegime = '', password, } = object;
        if (!rfc)
            return ['Missing RFC'];
        if (!businessName)
            return ['Missing Business Name'];
        if (!name)
            return ['Missing name'];
        if (!email)
            return ['Missing email'];
        if (!validators_1.Validators.email.test(email))
            return ['Email is not valid'];
        if (!password)
            return ['Missing password'];
        if (password.length < 6)
            return ['Password too short'];
        return [undefined, new CreateClientDto({
                name,
                email,
                rfc,
                businessName,
                taxRegime,
                password,
            })];
    }
}
exports.CreateClientDto = CreateClientDto;
