export class SearchMexicoProductsRequestDto {
  private constructor(public readonly term: string) {}

  static execute(value: unknown): [string?, SearchMexicoProductsRequestDto?] {
    if (typeof value !== "string" || !value.trim()) {
      return ["Search term is required"];
    }

    return [, new SearchMexicoProductsRequestDto(value.trim().toUpperCase())];
  }
}
