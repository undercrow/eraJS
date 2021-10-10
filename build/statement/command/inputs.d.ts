import Lazy from "../../lazy";
import type VM from "../../vm";
import Statement from "../index";
export default class InputS extends Statement {
    arg: Lazy<string | undefined>;
    constructor(raw: string);
    run(vm: VM): ReturnType<Statement["run"]>;
}
