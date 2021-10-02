import {assertNumber} from "../../assert";
import type VM from "../../vm";
import type Expr from "../expr";

export default function unicode(vm: VM, arg: Expr[]): string {
	const value = arg[0].reduce(vm);
	assertNumber(value, "1st Argument of UNICODE should be a number");

	return String.fromCharCode(value);
}
