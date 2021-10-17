import Lazy from "../../lazy";
import Slice from "../../slice";
import type VM from "../../vm";
import Statement from "../index";
export default class Input extends Statement {
    arg: Lazy<number | undefined>;
    constructor(raw: Slice);
    run(vm: VM): ReturnType<Statement["run"]>;
}
