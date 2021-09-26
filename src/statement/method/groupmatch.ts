import {assert} from "../../assert";
import type VM from "../../vm";

export default function groupMatch(_vm: VM, arg: Array<string | number>): number {
	assert(arg.length > 0, "1st argument of GROUPMATCH must exist");
	const key = arg[0];
	const values = arg.slice(1);

	return values.reduce((acc: number, val) => acc + (val === key ? 1 : 0), 0);
}
