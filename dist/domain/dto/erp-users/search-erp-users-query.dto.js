"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchErpUsersQueryDto = void 0;
class SearchErpUsersQueryDto {
    constructor(props) {
        this.query = props.query;
        this.by = props.by;
        this.limit = props.limit;
    }
    static create(input) {
        if (!input || typeof input !== "object")
            return ["Invalid query params."];
        const qRaw = typeof input.q === "string"
            ? input.q
            : "";
        const byRaw = typeof input.by === "string"
            ? input.by
            : "both";
        const limitRaw = input.limit;
        const qRawString = qRaw;
        const byRawString = byRaw;
        const query = qRawString.trim();
        const by = byRawString.trim().toLowerCase();
        const limitParsed = typeof limitRaw === "string" ? Number(limitRaw) :
            typeof limitRaw === "number" ? limitRaw : 20;
        if (!query)
            return ["q is required."];
        const validBy = ["code", "description", "both"];
        if (!validBy.includes(by))
            return ["by is invalid."];
        if (!Number.isInteger(limitParsed) || limitParsed <= 0 || limitParsed > 100) {
            return ["limit must be an integer between 1 and 100."];
        }
        return [
            undefined,
            new SearchErpUsersQueryDto({
                query,
                by: by,
                limit: limitParsed,
            }),
        ];
    }
}
exports.SearchErpUsersQueryDto = SearchErpUsersQueryDto;
