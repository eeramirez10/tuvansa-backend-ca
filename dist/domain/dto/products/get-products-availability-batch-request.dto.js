"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetProductsAvailabilityBatchRequestDto = void 0;
class GetProductsAvailabilityBatchRequestDto {
    constructor(eans, warehouseCodes) {
        this.eans = eans;
        this.warehouseCodes = warehouseCodes;
    }
    static execute(input) {
        if (!input || typeof input !== "object" || Array.isArray(input)) {
            return ["Body is required"];
        }
        const rawEans = input.eans;
        if (!Array.isArray(rawEans) || rawEans.length === 0) {
            return ["eans must be a non-empty array"];
        }
        if (rawEans.length > 100) {
            return ["eans accepts a maximum of 100 values"];
        }
        if (rawEans.some((ean) => typeof ean !== "string" || !ean.trim() || ean.trim().length > 100)) {
            return ["Every ean must be a non-empty string of 100 characters or fewer"];
        }
        const rawWarehouseCodes = input.warehouseCodes;
        let warehouseCodes = null;
        if (rawWarehouseCodes !== undefined) {
            if (!Array.isArray(rawWarehouseCodes) || rawWarehouseCodes.length === 0 || rawWarehouseCodes.length > 25) {
                return ["warehouseCodes must be a non-empty array with a maximum of 25 values"];
            }
            if (rawWarehouseCodes.some((code) => typeof code !== "string" || !/^\d{1,4}$/.test(code.trim()))) {
                return ["Every warehouse code must contain between 1 and 4 digits"];
            }
            warehouseCodes = Array.from(new Set(rawWarehouseCodes.map((code) => code.trim().padStart(2, "0"))));
        }
        const eans = Array.from(new Set(rawEans.map((ean) => ean.trim())));
        return [, new GetProductsAvailabilityBatchRequestDto(eans, warehouseCodes)];
    }
}
exports.GetProductsAvailabilityBatchRequestDto = GetProductsAvailabilityBatchRequestDto;
