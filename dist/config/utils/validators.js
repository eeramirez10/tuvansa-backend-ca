"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Validators = void 0;
const validator_1 = __importDefault(require("validator"));
class Validators {
    static get email() {
        return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    }
    static isUUID(id) {
        return validator_1.default.isUUID(id);
    }
}
exports.Validators = Validators;
