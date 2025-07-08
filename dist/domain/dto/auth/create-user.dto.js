"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUserDto = exports.BRANCHS = void 0;
const create_auth_dto_1 = require("./create-auth.dto");
const validators_1 = require("../../../config/utils/validators");
exports.BRANCHS = [
    'MEXICO',
    'MONTERREY',
    'VERACRUZ',
    'MEXICALI',
    'QUERETARO',
    'CANCUN',
];
class CreateUserDto extends create_auth_dto_1.CreateAuthDto {
    constructor(options) {
        super(options);
        this.name = options.name;
        this.lastname = options.lastname;
        this.email = options.email;
        this.password = options.password;
        this.isActive = options.isActive;
        this.username = options.username;
        this.branch = options.branch;
        this.role = options.role;
        this.accesibleBranches = options.accesibleBranches;
    }
    static execute(options) {
        const { name, lastname, email, password, role, isActive = true, branch, username, accesibleBranches } = options;
        if (!name)
            return ['Missing name'];
        if (!lastname)
            return ['Missing lastname'];
        if (!username)
            return ['Missing username'];
        if (!email)
            return ['Missing email'];
        if (!branch)
            return ['Missing branch'];
        if (!exports.BRANCHS.includes(branch.toUpperCase()))
            return [`${branch} is not a valid branch`];
        if (!validators_1.Validators.email.test(email))
            return ['Email is not valid'];
        if (!password)
            return ['Missing password'];
        if (password.length < 6)
            return ['Password too short'];
        if (accesibleBranches) {
            if (!Array.isArray(accesibleBranches))
                return ['Branches must be string array'];
            if (!accesibleBranches.every(b => exports.BRANCHS.includes(b)))
                return [`Branchs  not allowed`];
        }
        return [
            undefined,
            new CreateUserDto({
                name,
                lastname,
                email,
                password,
                role,
                isActive,
                branch: branch.toUpperCase(),
                username,
                accesibleBranches
            })
        ];
    }
}
exports.CreateUserDto = CreateUserDto;
