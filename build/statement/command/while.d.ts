import Lazy from "../../lazy";
import type Thunk from "../../thunk";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";
export default class While extends Statement {
    static parse(arg: string, lines: string[], from: number): [While, number];
    condition: Lazy<Expr>;
    thunk: Thunk;
    constructor(arg: string, thunk: Thunk);
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
