// get-erp-user-by-code-params.dto.ts
interface GetErpUserByCodeParamsDtoProps {
  code: string;
}

export class GetErpUserByCodeParamsDto {
  readonly code: string;

  constructor(props: GetErpUserByCodeParamsDtoProps) {
    this.code = props.code;
  }

  static create(input: unknown): [string?, GetErpUserByCodeParamsDto?] {
    if (!input || typeof input !== "object") return ["Invalid params."];

    const codeRaw = typeof (input as Record<string, unknown>).code === "string"
      ? (input as Record<string, unknown>).code
      : "";

    const codeRawString = codeRaw as string
    const code = codeRawString.trim();
    if (!code) return ["code is required."];

    return [undefined, new GetErpUserByCodeParamsDto({ code })];
  }
}
