import Lazy from "../../lazy";
import Slice from "../../slice";
import type VM from "../../vm";
import Statement from "../index";
export default class CustomDrawLine extends Statement {
    arg: Lazy<string>;
    constructor(raw: Slice);
    run(vm: VM): AsyncGenerator<import("../index").Output, null, string | null>;
}
