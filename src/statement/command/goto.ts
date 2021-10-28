import * as assert from "../../assert";
import * as C from "../../parser/const";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Slice from "../../slice";
import type VM from "../../vm";
import Statement from "../index";

const PARSER = U.arg1R1(C.Identifier);
export default class Goto extends Statement {
	public static *exec(vm: VM, target: string) {
		const realTarget = target.toUpperCase();
		const context = vm.context();
		assert.cond(
			context.fn.thunk.labelMap.has(realTarget),
			`Label ${realTarget} does not exist`,
		);

		return <const>{
			type: "goto",
			label: target,
		};
	}

	public arg: Lazy<string>;

	public constructor(raw: Slice) {
		super(raw);

		this.arg = new Lazy(raw, PARSER);
	}

	// eslint-disable-next-line @typescript-eslint/require-await
	public async *run(vm: VM) {
		const target = this.arg.get();
		return yield* Goto.exec(vm, target);
	}
}
