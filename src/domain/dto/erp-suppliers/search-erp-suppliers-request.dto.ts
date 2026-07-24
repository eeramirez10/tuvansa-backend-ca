export class SearchErpSuppliersRequestDto {
  private constructor(public readonly q: string, public readonly limit: number) {}

  static execute(query: Record<string, unknown>): [string?, SearchErpSuppliersRequestDto?] {
    const q = typeof query.q === "string" ? query.q.trim().toUpperCase() : "";
    const rawLimit = Number(query.limit);
    const limit = Number.isFinite(rawLimit) ? Math.min(50, Math.max(1, Math.trunc(rawLimit))) : 20;
    if (!q) return ["q is required"];
    return [, new SearchErpSuppliersRequestDto(q, limit)];
  }
}
