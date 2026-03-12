

interface Option {
  ean: string
  branchId: string
}


export class GetByEanAndBranchRequestDto {

  public readonly ean: string
  public readonly branchId: string

  constructor(option: Option) {
    this.ean = option.ean
    this.branchId = option.branchId
  }

 static  execute(request: Record<string, string>): [string?, GetByEanAndBranchRequestDto?] {
    const { ean, branchId } = request

    if (!request.ean) return ['Ean is required']
    if (!request.branchId) return ['Branch is requred']
    return [, new GetByEanAndBranchRequestDto({ ean, branchId })]
  }

}