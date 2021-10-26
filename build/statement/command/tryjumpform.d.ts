import Slice from "../../slice";
import type VM from "../../vm";
import Statement from "../index";
import CallForm from "./callform";
export default class TryJumpForm extends Statement {
    arg: CallForm["arg"];
    constructor(raw: Slice);
    run(vm: VM): Generator<import("../index").Output, import("../index").Result | null, string>;
}
