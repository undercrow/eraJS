import Slice from "../../slice";
import type VM from "../../vm";
import Statement from "../index";
import AssignForm from "./assign-form";
import AssignInt from "./assign-int";
import AssignOpInt from "./assign-op-int";
import AssignOpStr from "./assign-op-str";
import AssignPostfix from "./assign-postfix";
import AssignStr from "./assign-str";
export default class Assign extends Statement {
    inner?: AssignForm | AssignInt | AssignOpInt | AssignOpStr | AssignPostfix | AssignStr;
    constructor(raw: Slice);
    run(vm: VM): AsyncGenerator<import("../index").Output, import("../index").Result | null, string | null>;
}
