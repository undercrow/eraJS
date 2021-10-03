import type VM from "../../vm";
import Statement from "../index";
import AssignForm from "./assign-form";
import AssignInt from "./assign-int";
import AssignOpInt from "./assign-op-int";
import AssignOpStr from "./assign-op-str";
import AssignStr from "./assign-str";
export default class Assign extends Statement {
    raw: string;
    inner?: AssignForm | AssignInt | AssignOpInt | AssignOpStr | AssignStr;
    constructor(raw: string);
    run(vm: VM): Generator<never, null, unknown>;
}
