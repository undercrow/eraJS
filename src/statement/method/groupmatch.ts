import * as assert from "../../assert";
import type VM from "../../vm";
import type Expr from "../expr";

export default async function groupMatch(vm: VM, arg: Expr[]): Promise<number> {
	assert.cond(arg.length > 0, "1st argument of GROUPMATCH must exist");
	const key = await arg[0].reduce(vm);
	const values: Array<string | number> = [];
	for (const a of arg.slice(1)) {
		values.push(await a.reduce(vm));
	}

	return values.reduce((acc: number, val) => acc + (val === key ? 1 : 0), 0);
}
