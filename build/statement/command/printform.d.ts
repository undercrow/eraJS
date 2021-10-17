import Lazy from "../../lazy";
import Slice from "../../slice";
import type VM from "../../vm";
import Form from "../expr/form";
import Statement from "../index";
export default class PrintForm extends Statement {
    postfix: string;
    arg: Lazy<Form>;
    constructor(instruction: string, raw: Slice);
    run(vm: VM): Generator<import("../index").Output, null, string | null>;
}
