import {assertNumber} from "../../assert";
import type VM from "../../vm";
import type Expr from "../expr";

export default function power(vm: VM, arg: Expr[]): number {
	const base = arg[0].reduce(vm);
	assertNumber(base, "1st argument of POWER must be a number");
	const exponent = arg[1].reduce(vm);
	assertNumber(exponent, "2nd argument of POWER must be a number");

	return base ** exponent;
}
