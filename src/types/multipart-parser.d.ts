declare module "@web3-storage/multipart-parser" {
  interface FormFile {
    name: string;
    filename: string;
    type: string;
    data: Uint8Array;
  }

  interface FormField {
    name: string;
    value: string;
  }

  export function parser(
    body: AsyncIterable<Uint8Array>,
    contentType: string
  ): AsyncGenerator<FormFile | FormField>;

  export function readForm(
    parts: AsyncGenerator<FormFile | FormField>
  ): Promise<Map<string, any>>;
}
