import type { Chunk, EraGenerator, Output } from "./statement";
export declare type PrintFlag = "K" | "D" | "W" | "L" | "S";
export default class Printer {
    buffer: Output[];
    chunks: Chunk[];
    align: "LEFT" | "CENTER" | "RIGHT";
    font: {
        name: string;
        bold: boolean;
        italic: boolean;
        strike: boolean;
        underline: boolean;
    };
    defaultBackground: string;
    defaultColor: string;
    background: string;
    color: string;
    focus: string;
    lineCount: number;
    draw: boolean;
    skipDisp: boolean;
    isLineTemp: boolean;
    constructor();
    private clearTemp;
    flush(): EraGenerator<void>;
    newline(): EraGenerator<void>;
    print(text: string, flags: Set<PrintFlag>, cell?: "LEFT" | "RIGHT"): EraGenerator<void>;
    button(text: string, value: string, cell?: "LEFT" | "RIGHT"): EraGenerator<void>;
    line(value?: string): EraGenerator<void>;
    clear(count: number): EraGenerator<void>;
    wait(force: boolean): EraGenerator<void>;
    input(numeric: boolean, nullable: boolean): EraGenerator<string | null>;
    tinput(numeric: boolean, timeout: number, countdown: boolean): EraGenerator<string | null>;
}
