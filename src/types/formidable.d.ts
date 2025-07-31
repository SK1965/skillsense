// src/types/formidable.d.ts
declare module 'formidable' {
  import * as http from 'http'

  export interface Options {
    multiples?: boolean
    maxFileSize?: number
    // Add more as needed
  }

  export interface File {
    filepath: string
    originalFilename?: string
    mimetype?: string
    size?: number
  }

  export interface Fields {
    [key: string]: string | string[] | undefined
  }
  export interface Files {
    [key: string]: File | File[] | undefined
  }

  export class IncomingForm {
    constructor(options?: Options)
    parse(
      req: http.IncomingMessage,
      callback: (err: Error | null, fields: Fields, files: Files) => void
    ): void
  }

  export default function formidable(options?: Options): IncomingForm
}
