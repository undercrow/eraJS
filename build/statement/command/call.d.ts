import P from "parsimmon";
import Lazy from "../../lazy";
import type VM from "../../vm";
import Expr from "../expr";
import Statement from "../index";
export default class Call extends Statement {
    static PARSER: P.Parser<[string, (Expr | undefined)[]]>;
    static exec(vm: VM, target: string, argExpr: Array<Expr | undefined>): Generator<import("../index").Output, {
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
    arg: Lazy<[string, Array<Expr | undefined>]>;
    constructor(raw: string);
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
