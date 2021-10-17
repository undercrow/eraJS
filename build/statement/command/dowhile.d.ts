import Lazy from "../../lazy";
import Slice from "../../slice";
import type Thunk from "../../thunk";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";
export default class DoWhile extends Statement {
    static parse(arg: Slice, lines: Slice[], from: number): [DoWhile, number];
    arg: Lazy<Expr>;
    thunk: Thunk;
    constructor(raw: Slice, thunk: Thunk);
    run(vm: VM, label?: string): Generator<import("../index").Output, {
        type: "begin";
        keyword: string;
    } | {
        type: "goto";
        label: string;
    } | {
        type: "throw";
        value: string;
    } | {
        type: "return";
        value: (string | number)[];
    } | {
        type: "quit";
    } | null, string | null>;
}
