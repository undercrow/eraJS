import Lazy from "../../lazy";
import type VM from "../../vm";
import Statement from "../index";
export default class Print extends Statement {
    static print(vm: VM, text: string): ReturnType<Statement["run"]>;
    static runPostfix(vm: VM, value: string): ReturnType<Statement["run"]>;
    postfix: string;
    value: Lazy<string>;
    constructor(instruction: string, raw: string);
    run(vm: VM): Generator<import("../index").Output, null, string>;
}
