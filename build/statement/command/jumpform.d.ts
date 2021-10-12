import Lazy from "../../lazy";
import type VM from "../../vm";
import Expr from "../expr";
import Form from "../expr/form";
import Statement from "../index";
export default class JumpForm extends Statement {
    arg: Lazy<[Form, Array<Expr | undefined>]>;
    constructor(raw: string);
    run(vm: VM): Generator<import("../index").Output, import("../index").Result | null, string>;
}
