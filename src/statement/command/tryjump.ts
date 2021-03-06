import type VM from "../../vm";
import Expr from "../expr";
import Statement from "../index";
import Call from "./call";
import Jump from "./jump";

export default class TryJump extends Statement {
	public static parse(raw: string): TryJump {
		const [target, arg] = Call.compileArg(raw);
		return new TryJump(target, arg);
	}

	public target: string;
	public arg: Expr[];

	public constructor(target: string, arg: Expr[]) {
		super();
		this.target = target;
		this.arg = arg;
	}

	public *run(vm: VM) {
		const target = this.target.toUpperCase();
		if (vm.fnMap.has(target)) {
			return yield* new Jump(target, this.arg).run(vm);
		}

		return null;
	}
}
