import type { EraGenerator, Output } from "./statement";
export declare type PrintFlag = "K" | "D" | "W" | "L" | "S";
export default class OutputQueue {
    buffer: Output[];
    lineCount: number;
    draw: boolean;
    skipDisp: boolean;
    isLineEmpty: boolean;
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
    input(numeric: boolean, timeout?: number, showClock?: boolean): EraGenerator<string | null>;
}
