// search-erp-users-query.dto.ts
type ErpUserSearchBy = "code" | "description" | "both";

interface SearchErpUsersQueryDtoProps {
  query: string;
  by: ErpUserSearchBy;
  limit: number;
}

export class SearchErpUsersQueryDto {
  readonly query: string;
  readonly by: ErpUserSearchBy;
  readonly limit: number;

  constructor(props: SearchErpUsersQueryDtoProps) {
    this.query = props.query;
    this.by = props.by;
    this.limit = props.limit;
  }

  static create(input: unknown): [string?, SearchErpUsersQueryDto?] {

    if (!input || typeof input !== "object") return ["Invalid query params."];

    const qRaw = typeof (input as Record<string, unknown>).q === "string"
      ? (input as Record<string, unknown>).q
      : ""

    const byRaw = typeof (input as Record<string, unknown>).by === "string"
      ? (input as Record<string, unknown>).by
      : "both";
      
    const limitRaw = (input as Record<string, unknown>).limit;

    const qRawString  =  qRaw as string
    const byRawString = byRaw as string

    const query = qRawString.trim();
    const by = byRawString.trim().toLowerCase();
    const limitParsed =
      typeof limitRaw === "string" ? Number(limitRaw) :
        typeof limitRaw === "number" ? limitRaw : 20;

    if (!query) return ["q is required."];

    const validBy: ErpUserSearchBy[] = ["code", "description", "both"];
    if (!validBy.includes(by as ErpUserSearchBy)) return ["by is invalid."];

    if (!Number.isInteger(limitParsed) || limitParsed <= 0 || limitParsed > 100) {
      return ["limit must be an integer between 1 and 100."];
    }

    return [
      undefined,
      new SearchErpUsersQueryDto({
        query,
        by: by as ErpUserSearchBy,
        limit: limitParsed,
      }),
    ];
  }
}
