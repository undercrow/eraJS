import Lazy from "../../lazy";
import type VM from "../../vm";
import Form from "../expr/form";
import Statement from "../index";
export default class PrintForm extends Statement {
    postfix: string;
    value: Lazy<Form>;
    constructor(instruction: string, raw: string);
    run(vm: VM): Generator<import("../index").Output, null, string>;
}
