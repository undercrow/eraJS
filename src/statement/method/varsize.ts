import {assert, assertString} from "../../assert";
import type VM from "../../vm";

export default function varSize(vm: VM, arg: Array<string | number>): number {
	const name = arg[0];
	assertString(name, "1st Argument of VARSIZE should be a string");
	const dim = arg[1];
	assert(
		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
		dim == null || typeof dim === "number",
		"2nd Argument of VARSIZE should be a number",
	);

	const index = [];
	// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
	for (let i = 0; i < dim ?? 0; ++i) {
		index.push(0);
	}

	return vm.lengthOf(name, ...index);
}
