import Lazy from "../../lazy";
import type VM from "../../vm";
import Statement from "../index";
export default class Input extends Statement {
    arg: Lazy<number | undefined>;
    constructor(raw: string);
    run(vm: VM): ReturnType<Statement["run"]>;
}
