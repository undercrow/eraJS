import Lazy from "../../lazy";
import Slice from "../../slice";
import type VM from "../../vm";
import Form from "../expr/form";
import Statement from "../index";
export default class PrintSingleForm extends Statement {
    postfix: string;
    arg: Lazy<Form>;
    constructor(postfix: string, raw: Slice);
    run(vm: VM): Generator<import("../index").Output, null, string | null>;
}
