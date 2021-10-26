import Slice from "../../slice";
import type VM from "../../vm";
import Statement from "../index";
export default class UpCheck extends Statement {
    constructor(raw: Slice);
    run(vm: VM): Generator<import("../index").Output, null, string | null>;
}
