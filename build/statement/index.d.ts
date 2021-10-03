import type VM from "../vm";
export declare type Output = {
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
    type: "clearline";
    count: number;
} | {
    type: "loadgame";
} | {
    type: "wait";
} | {
    type: "input";
} | {
    type: "redraw";
    value: number;
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
export default class Statement {
    run(_vm: VM, _label?: string): Generator<Output, Result | null, string>;
}
