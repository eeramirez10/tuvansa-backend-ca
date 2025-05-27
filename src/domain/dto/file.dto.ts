import { Option } from '../entities/pagination-result';

export type FileType = 'pdf' | 'xml'


interface FileDtoOptions {
  type: FileType,
  filename: string
}

export class FileDto {

  readonly type: FileType
  readonly filename: string

  constructor(option: FileDtoOptions) {
    this.type = option.type
    this.filename = option.filename
  }


  static exec(object: { [key: string]: any }): [string?, FileDto?] {

    const { type, filename } = object

    if (!type) return ['type is required']
    if (!filename) return ['filename is required']
    if (type != 'pdf' && type != 'xml') return [`file type ${type} no allowed`]

    return [, new FileDto({ type, filename })]


  }
}