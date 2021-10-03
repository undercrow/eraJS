import VM from "../../vm";
import Statement from "../index";
export default class GetColor extends Statement {
    constructor(arg: string);
    run(vm: VM): Generator<never, null, unknown>;
}
