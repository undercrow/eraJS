import {assert, assertNumber} from "../../assert";
import type VM from "../../vm";

export default function getBit(_vm: VM, arg: Array<string | number>): number {
	const value = arg[0];
	assertNumber(value, "1st argument of GETBIT should be a number");
	const index = arg[1];
	assertNumber(index, "2nd argument of GETBIT should be a number");
	assert(index < 32, "2nd argument of GETBIT should be less than 32");

	// eslint-disable-next-line no-bitwise
	return (value & (1 << index)) !== 0 ? 1 : 0;
}
