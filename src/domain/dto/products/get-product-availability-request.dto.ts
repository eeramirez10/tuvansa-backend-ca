export class GetProductAvailabilityRequestDto {
  private constructor(public readonly ean: string) {}

  public static execute(value: unknown): [string?, GetProductAvailabilityRequestDto?] {
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
