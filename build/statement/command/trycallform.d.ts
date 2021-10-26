import Slice from "../../slice";
import type VM from "../../vm";
import Statement from "../index";
import CallForm from "./callform";
export default class TryCallForm extends Statement {
    arg: CallForm["arg"];
    constructor(raw: Slice);
    run(vm: VM): Generator<import("../index").Output, {
        type: "begin";
        keyword: string;
    } | {
        type: "goto";
        label: string;
    } | {
        type: "break";
    } | {
        type: "continue";
    } | {
        type: "throw";
        value: string;
    } | {
        type: "quit";
    } | null, string>;
}
