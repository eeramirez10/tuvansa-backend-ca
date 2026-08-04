export class SearchProductsByWarehousesRequestDto {
  private constructor(
    public readonly term: string,
    public readonly warehouseCodes: string[],
  ) {}

  static execute(input: unknown): [string?, SearchProductsByWarehousesRequestDto?] {
    if (!input || typeof input !== "object" || Array.isArray(input)) {
      return ["Body is required"];
    }

    const body = input as Record<string, unknown>;
    const term = typeof body.query === "string" ? body.query.trim().toUpperCase() : "";
    if (!term) return ["query is required"];
    if (term.length > 160) return ["query must be 160 characters or fewer"];

    if (!Array.isArray(body.warehouseCodes) || body.warehouseCodes.length === 0) {
      return ["warehouseCodes must be a non-empty array"];
    }
    if (body.warehouseCodes.length > 25) {
      return ["warehouseCodes accepts a maximum of 25 values"];
    }

    const warehouseCodes: string[] = [];
    for (const value of body.warehouseCodes) {
      if (typeof value !== "string" || !/^\d{1,4}$/.test(value.trim())) {
        return ["Every warehouse code must contain between 1 and 4 digits"];
      }
      warehouseCodes.push(value.trim().padStart(2, "0"));
    }

    return [
      ,
      new SearchProductsByWarehousesRequestDto(
        term,
        Array.from(new Set(warehouseCodes)),
      ),
    ];
  }
}
