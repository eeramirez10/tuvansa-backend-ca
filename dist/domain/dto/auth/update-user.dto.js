"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserDto = void 0;
const validators_1 = require("../../../config/utils/validators");
class UpdateUserDto {
    constructor(options) {
        this.id = options.id;
        this.username = options.username;
        this.email = options.email;
        this.password = options.password;
        this.name = options.name;
        this.lastname = options.lastname;
        this.role = options.role;
        this.branch = options.branch;
        this.accesibleBranches = options.accesibleBranches;
        this.isActive = options.isActive;
    }
    static execute(options) {
        const { id, username, email, password, name, lastname, role, branch, isActive, accesibleBranches } = options;
        const data = {};
        const validBranches = ["MEXICO", "MONTERREY", "VERACRUZ", "MEXICALI", "QUERETARO", "CANCUN", "CABOS"];
        const validRoles = ["USER", "ADMIN"];
        if (!id)
            return ['id is Required'];
        if (!validators_1.Validators.isUUID(id))
            return ['Id is not valid'];
        if (username !== undefined)
            data.username = username;
        if (email !== undefined)
            data.email = email;
        if (name !== undefined)
            data.name = name;
        if (lastname !== undefined)
            data.lastname = lastname;
        if (role !== undefined && validRoles.includes(role.toUpperCase()))
            data.role = role.toUpperCase();
        if (branch !== undefined && validBranches.includes(branch))
            data.branch = branch.toUpperCase();
        if (isActive !== undefined)
            data.isActive = isActive;
        if (password !== undefined)
            data.password = password;
        if (accesibleBranches !== undefined) {
            if (!Array.isArray(accesibleBranches) ||
                !accesibleBranches.every((b) => validBranches.includes(b.toUpperCase()))) {
                return ['Branchs no valid'];
            }
            data.accesibleBranches = accesibleBranches;
        }
        data.id = id;
        return [undefined, data];
    }
}
exports.UpdateUserDto = UpdateUserDto;
