export class GetProductsAvailabilityBatchRequestDto {
  private constructor(public readonly eans: string[]) {}

  public static execute(input: unknown): [string?, GetProductsAvailabilityBatchRequestDto?] {
    if (!input || typeof input !== "object" || Array.isArray(input)) {
      return ["Body is required"];
    }

    const rawEans = (input as Record<string, unknown>).eans;
    if (!Array.isArray(rawEans) || rawEans.length === 0) {
      return ["eans must be a non-empty array"];
    }

    if (rawEans.length > 100) {
      return ["eans accepts a maximum of 100 values"];
    }

    if (rawEans.some((ean) => typeof ean !== "string" || !ean.trim() || ean.trim().length > 100)) {
      return ["Every ean must be a non-empty string of 100 characters or fewer"];
    }

    const eans = Array.from(new Set(rawEans.map((ean) => (ean as string).trim())));
    return [, new GetProductsAvailabilityBatchRequestDto(eans)];
  }
}
