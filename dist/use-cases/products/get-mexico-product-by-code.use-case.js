"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetMexicoProductByCodeUseCase = void 0;
class GetMexicoProductByCodeUseCase {
    constructor(repository) {
        this.repository = repository;
    }
    execute(code) {
        return this.repository.findByCodeInMexico(code);
    }
}
exports.GetMexicoProductByCodeUseCase = GetMexicoProductByCodeUseCase;
