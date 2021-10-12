import VM from "../../vm";
import Statement from "../index";
export default class GetFocusColor extends Statement {
    constructor(arg: string);
    run(vm: VM): Generator<never, null, unknown>;
}
