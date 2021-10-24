import Lazy from "../../lazy";
import Slice from "../../slice";
import type VM from "../../vm";
import Form from "../expr/form";
import Statement from "../index";
export default class GotoForm extends Statement {
    arg: Lazy<Form>;
    constructor(raw: Slice);
    run(vm: VM): Generator<never, {
        readonly type: "goto";
        readonly label: string;
    }, unknown>;
}
