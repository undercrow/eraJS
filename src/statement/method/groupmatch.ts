import {assert} from "../../assert";
import type VM from "../../vm";
import type Expr from "../expr";

export default function groupMatch(vm: VM, arg: Expr[]): number {
	assert(arg.length > 0, "1st argument of GROUPMATCH must exist");
	const key = arg[0].reduce(vm);
	const values = arg.slice(1).map((a) => a.reduce(vm));

	return values.reduce((acc: number, val) => acc + (val === key ? 1 : 0), 0);
}
