import type VM from "../../vm";
import Expr from "../expr";
import Statement from "../index";
export default class TryJump extends Statement {
    static parse(raw: string): TryJump;
    target: string;
    arg: (Expr | undefined)[];
    constructor(target: string, arg: TryJump["arg"]);
    run(vm: VM): Generator<import("../index").Output, import("../index").Result | null, string>;
}
