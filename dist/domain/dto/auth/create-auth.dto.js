"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateAuthDto = exports.Branch = exports.Role = void 0;
var Role;
(function (Role) {
    Role[Role["USER"] = 0] = "USER";
    Role[Role["ADMIN"] = 1] = "ADMIN";
})(Role || (exports.Role = Role = {}));
var Branch;
(function (Branch) {
    Branch[Branch["MEXICO"] = 0] = "MEXICO";
    Branch[Branch["MONTERREY"] = 1] = "MONTERREY";
    Branch[Branch["VERACRUZ"] = 2] = "VERACRUZ";
    Branch[Branch["MEXICALI"] = 3] = "MEXICALI";
    Branch[Branch["QUERETARO"] = 4] = "QUERETARO";
    Branch[Branch["CANCUN"] = 5] = "CANCUN";
})(Branch || (exports.Branch = Branch = {}));
class CreateAuthDto {
    constructor(options) {
        this.email = options.email;
        this.password = options.password;
        this.name = options.name;
    }
}
exports.CreateAuthDto = CreateAuthDto;
