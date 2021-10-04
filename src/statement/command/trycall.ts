import type VM from "../../vm";
import Expr from "../expr";
import Statement from "../index";
import Call from "./call";

export default class TryCall extends Statement {
	public static parse(raw: string): TryCall {
		const [target, arg] = Call.PARSER.tryParse(raw);
		return new TryCall(target, arg);
	}

	public target: string;
	public arg: (Expr | undefined)[];

	public constructor(target: string, arg: TryCall["arg"]) {
		super();
		this.target = target;
		this.arg = arg;
	}

	public *run(vm: VM) {
		const target = this.target.toUpperCase();
		if (vm.fnMap.has(target)) {
			return yield* Call.exec(vm, target, this.arg);
		}

		return null;
	}
}
