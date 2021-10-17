import Lazy from "../../lazy";
import Slice from "../../slice";
import type VM from "../../vm";
import Statement from "../index";
export default class Print extends Statement {
    static runPostfix(vm: VM, value: string): ReturnType<Statement["run"]>;
    postfix: string;
    value: Lazy<string>;
    constructor(instruction: string, raw: Slice);
    run(vm: VM): Generator<import("../index").Output, null, string | null>;
}
