"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetErpUserByCodeParamsDto = void 0;
class GetErpUserByCodeParamsDto {
    constructor(props) {
        this.code = props.code;
    }
    static create(input) {
        if (!input || typeof input !== "object")
            return ["Invalid params."];
        const codeRaw = typeof input.code === "string"
            ? input.code
            : "";
        const codeRawString = codeRaw;
        const code = codeRawString.trim();
        if (!code)
            return ["code is required."];
        return [undefined, new GetErpUserByCodeParamsDto({ code })];
    }
}
exports.GetErpUserByCodeParamsDto = GetErpUserByCodeParamsDto;
