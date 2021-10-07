import type Thunk from "../../thunk";
import type VM from "../../vm";
import type Expr from "../expr";
import type Variable from "../expr/variable";
import Statement from "../index";
export default class For extends Statement {
    static parse(arg: string, lines: string[], from: number): [For, number];
    raw: string;
    thunk: Thunk;
    counter?: Variable;
    start?: Expr;
    end?: Expr;
    step?: Expr;
    constructor(raw: string, thunk: Thunk);
    compile(): void;
    run(vm: VM, label?: string): Generator<import("../index").Output, import("../index").Result | null, string | null>;
}
