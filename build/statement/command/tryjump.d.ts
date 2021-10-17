import Slice from "../../slice";
import type VM from "../../vm";
import Statement from "../index";
import Jump from "./jump";
export default class TryJump extends Statement {
    arg: Jump["arg"];
    constructor(raw: Slice);
    run(vm: VM): Generator<import("../index").Output, import("../index").Result | null, string>;
}
