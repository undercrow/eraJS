import Slice from "../slice";
import type { Leaf } from "../value";
import type VM from "../vm";
export declare type StringChunk = {
    type: "string";
    text: string;
    cell?: "LEFT" | "RIGHT";
    style: {
        color: string;
        focus: string;
        font: string;
        bold: boolean;
        italic: boolean;
        strike: boolean;
        underline: boolean;
    };
};
export declare type ButtonChunk = {
    type: "button";
    text: string;
    value: string;
    cell?: "LEFT" | "RIGHT";
    style: {
        color: string;
        focus: string;
        font: string;
        bold: boolean;
        italic: boolean;
        strike: boolean;
        underline: boolean;
    };
};
export declare type Chunk = StringChunk | ButtonChunk;
export declare type ContentOutput = {
    type: "content";
    children: Chunk[];
    align: "LEFT" | "CENTER" | "RIGHT";
};
export declare type LineOutput = {
    type: "line";
    value?: string;
};
export declare type ClearOutput = {
    type: "clear";
    count: number;
};
export declare type WaitOutput = {
    type: "wait";
    force: boolean;
};
export declare type InputOutput = {
    type: "input";
    numeric: boolean;
    nullable: boolean;
};
export declare type TInputOutput = {
    type: "tinput";
    numeric: boolean;
    timeout: number;
    countdown: boolean;
};
export declare type Output = ContentOutput | LineOutput | ClearOutput | WaitOutput | InputOutput | TInputOutput;
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
    value: Array<Leaf>;
} | {
    type: "quit";
};
export declare type EraGenerator<T = Result | null> = AsyncGenerator<Output, T, string | null>;
export default class Statement {
    raw: Slice;
    constructor(raw: Slice);
    run(_vm: VM, _label?: string): EraGenerator;
}
