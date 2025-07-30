

export class FindByEanDto {


  readonly ean: string

  constructor(ean: string) {
    this.ean = ean
  }

  static execute(ean: string): [string?, FindByEanDto?] {

    if (!ean) return ['Ean is required']



    return [, new FindByEanDto(ean)]
  }
}