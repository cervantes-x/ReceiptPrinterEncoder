import printer_models from "../../generated/printers";
import mappings from "../../generated/mapping";

declare module "@point-of-sale/receipt-printer-encoder" {
  type PrinterModel = keyof typeof printer_models;

  type CodePageMapping =
    | keyof (typeof mappings)["esc-pos"]
    | keyof (typeof mappings)["star-prnt"];

  type Language = "esc-pos" | "star-prnt" | "star-line";

  type ImageMode = "column" | "raster";

  type CodePage =
    | "auto"
    | "cp437"
    | "cp737"
    | "cp850"
    | "cp775"
    | "cp852"
    | "cp855"
    | "cp857"
    | "cp858"
    | "cp860"
    | "cp861"
    | "cp862"
    | "cp863"
    | "cp864"
    | "cp865"
    | "cp866"
    | "cp869"
    | "cp936"
    | "cp949"
    | "cp950"
    | "cp1252"
    | "iso88596"
    | "shiftjis"
    | "windows1250"
    | "windows1251"
    | "windows1252"
    | "windows1253"
    | "windows1254"
    | "windows1255"
    | "windows1256"
    | "windows1257"
    | "windows1258";

  interface FontMapping {
    size: string;
    columns: number;
  }

  interface PrinterDefinition {
    capabilities: {
      fonts: Record<string, FontMapping>;
      language: Language;
      codepages: CodePage[];
      newline?: string;
      images?: {
        mode?: string;
      };
    };
    features?: {
      cutter?: {
        feed?: number;
      };
    };
  }

  interface LineComposer {
    text(value: string, codepage: string): void;
    raw(data: Uint8Array): void;
    flush(options?: { forceNewline?: boolean }): void;
    add(commands: any[], width: number): void;
    align: "left" | "center" | "right";
    columns: number;
    space(amount: number): void;
    fetch(reset?: boolean): any[];
    callback(value: any): void;
  }

  interface ReceiptPrinterOptions {
    columns?: number;
    /**
     * @deprecated The width parameter has now been changed to the columns parameter..
     */
    width?: number;
    language?: Language;
    imageMode?: ImageMode;
    feedBeforeCut?: number;
    newline?: string;
    codepageMapping?: CodePageMapping | Record<string, number>;
    codepageCandidates?: CodePageMapping[];
    debug?: boolean;
    embedded?: boolean;
    createCanvas?: (width: number, height: number) => HTMLCanvasElement;
    autoFlush?: boolean;
    printerModel?: PrinterModel;
  }

  export default class ReceiptPrinterEncoder {
    private options: ReceiptPrinterOptions;
    private queue: any[];
    private _language: any;
    private composer: LineComposer;
    private fontMapping: Record<string, FontMapping>;
    private codepageMapping: Record<string, number>;
    private codepageCandidates: string[];
    private _codepage: CodePage;
    private state: {
      codepage: number;
      font: string;
    };

    constructor(options?: ReceiptPrinterOptions);

    initialize(): this;

    codepage(codepage: CodePage): this;

    text(value: string): this;

    newline(count?: number): this;

    line(value: string): this;

    underline(value?: boolean | number): this;

    italic(value?: boolean): this;

    bold(value?: boolean): this;

    invert(value?: boolean): this;

    width(width: number): this;

    height(height: number): this;

    size(width: number | string, height?: number): this;

    font(value: "A" | "B"): this;

    align(value: "left" | "center" | "right"): this;

    table(
      columns: Array<{
        width?: number;
        marginLeft?: number;
        marginRight?: number;
        align?: "left" | "right";
        verticalAlign?: "top" | "bottom";
      }>,
      data: string[][]
    ): this;

    rule(options?: { style?: "single" | "double"; width?: number }): this;

    box(
      options: {
        style?: "none" | "single" | "double";
        width?: number;
        marginLeft?: number;
        marginRight?: number;
        paddingLeft?: number;
        paddingRight?: number;
        align: "left" | "right";
      },
      contents: string | ((encoder: ReceiptPrinterEncoder) => void)
    ): this;

    barcode(value: string, symbology: string, height?: number | object): this;

    qrcode(
      value: string,
      model?: number | object,
      size?: number,
      errorlevel?: string
    ): this;

    pdf417(value: string, options?: object): this;

    image(
      input: HTMLCanvasElement | ImageData | object,
      width: number,
      height: number,
      algorithm?: string,
      threshold?: number
    ): this;

    cut(value?: "full" | "partial"): this;

    pulse(device?: number, on?: number, off?: number): this;

    raw(data: Uint8Array): this;

    encode(): Uint8Array;

    commands(): any[];

    static get printerModels(): { id: string; name: string }[];

    get columns(): number;

    get language(): string;
  }
}
