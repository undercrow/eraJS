import * as E from "../../error";
import type VM from "../../vm";
import type Expr from "../expr";

export default function csvRelation(_vm: VM, _arg: Expr[]): number {
	throw E.notImpl("CSVRELATION");
}
