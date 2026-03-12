"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileDto = void 0;
class FileDto {
    constructor(option) {
        this.type = option.type;
        this.filename = option.filename;
    }
    static exec(object) {
        const { type, filename } = object;
        if (!type)
            return ['type is required'];
        if (!filename)
            return ['filename is required'];
        if (type != 'pdf' && type != 'xml')
            return [`file type ${type} no allowed`];
        return [, new FileDto({ type, filename })];
    }
}
exports.FileDto = FileDto;
