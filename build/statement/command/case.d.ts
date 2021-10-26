import Lazy from "../../lazy";
import Slice from "../../slice";
import Thunk from "../../thunk";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";
declare type Operator = "<" | "<=" | ">" | ">=";
declare type Condition = {
    type: "equal";
    value: string | number;
} | {
    type: "range";
    from: number;
    to: number;
} | {
    type: "compare";
    op: Operator;
    value: number;
};
export default class Case extends Statement {
    static parse(arg: Slice, lines: Slice[], from: number): [Case, number];
    arg: Lazy<Expr>;
    branch: Array<[Lazy<Condition[]>, Thunk]>;
    def: Thunk;
    constructor(raw: Slice, branch: Array<[Slice, Thunk]>, def: Thunk);
    run(vm: VM, label?: string): Generator<import("../index").Output, import("../index").Result | null, string | null>;
}
export {};
