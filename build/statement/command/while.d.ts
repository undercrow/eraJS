import Lazy from "../../lazy";
import Slice from "../../slice";
import type Thunk from "../../thunk";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";
export default class While extends Statement {
    static parse(arg: Slice, lines: Slice[], from: number): [While, number];
    arg: Lazy<Expr>;
    thunk: Thunk;
    constructor(raw: Slice, thunk: Thunk);
    run(vm: VM, label?: string): AsyncGenerator<import("../index").Output, {
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
        value: import("../../value").Leaf[];
    } | {
        type: "quit";
    } | null, string | null>;
}
