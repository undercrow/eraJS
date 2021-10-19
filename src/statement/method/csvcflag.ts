import * as E from "../../error";
import type VM from "../../vm";
import type Expr from "../expr";

export default function csvCflag(_vm: VM, _arg: Expr[]): number {
	throw E.notImpl("CSVCFLAG");
}
