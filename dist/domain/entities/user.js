"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserEntity = void 0;
class UserEntity {
    constructor(options) {
        this.name = options.name;
        this.id = options.id;
        this.username = options.username;
        this.email = options.email;
        this.password = options.password;
        this.role = options.role;
        this.branch = options.branch;
        this.isActive = options.isActive;
        this.createdAt = options.createdAt;
        this.updatedAt = options.updatedAt;
        this.lastname = options.lastname;
        this.accesibleBranches = options.accesibleBranches;
    }
}
exports.UserEntity = UserEntity;
