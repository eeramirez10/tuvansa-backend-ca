"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetProductAvailabilityRequestDto = void 0;
class GetProductAvailabilityRequestDto {
    constructor(ean) {
        this.ean = ean;
    }
    static execute(value) {
        if (typeof value !== "string" || !value.trim()) {
            return ["Ean is required"];
        }
        const ean = value.trim();
        if (ean.length > 100) {
            return ["Ean must be 100 characters or fewer"];
        }
        return [, new GetProductAvailabilityRequestDto(ean)];
    }
}
exports.GetProductAvailabilityRequestDto = GetProductAvailabilityRequestDto;
