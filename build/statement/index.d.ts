import Slice from "../slice";
import type VM from "../vm";
export declare type Output = {
    type: "newline";
} | {
    type: "string";
    text: string;
    cell?: "LEFT" | "RIGHT";
} | {
    type: "button";
    text: string;
    value: string;
    cell?: "LEFT" | "RIGHT";
} | {
    type: "line";
    value?: string;
} | {
    type: "clear";
    count: number;
} | {
    type: "wait";
    force: boolean;
} | {
    type: "input";
    numeric: boolean;
    nullable: boolean;
} | {
    type: "tinput";
    numeric: boolean;
    timeout: number;
    showClock: boolean;
};
export declare type Result = {
    type: "begin";
    keyword: string;
} | {
    type: "goto";
    label: string;
} | {
    type: "break";
} | {
    type: "continue";
} | {
    type: "throw";
    value: string;
} | {
    type: "return";
    value: Array<number | string>;
} | {
    type: "quit";
};
export declare type EraGenerator<T = Result | null> = AsyncGenerator<Output, T, string | null>;
export default class Statement {
    raw: Slice;
    constructor(raw: Slice);
    run(_vm: VM, _label?: string): EraGenerator;
}
