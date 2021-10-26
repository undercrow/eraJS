import Slice from "../../slice";
import type VM from "../../vm";
import Statement from "../index";
import Call from "./call";
export default class TryCall extends Statement {
    arg: Call["arg"];
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
