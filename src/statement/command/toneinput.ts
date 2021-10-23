import * as assert from "../../assert";
import * as C from "../../parser/const";
import * as X from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Slice from "../../slice";
import type Expr from "../expr";
import type VM from "../../vm";
import Statement from "../index";

const PARSER = U.arg4R2(X.expr, X.expr, X.expr, C.charSeq());
export default class TOneInput extends Statement {
	public arg: Lazy<[Expr, Expr, Expr | undefined, string | undefined]>;

	public constructor(raw: Slice) {
		super(raw);

		this.arg = new Lazy(raw, PARSER);
	}

	public *run(vm: VM): ReturnType<Statement["run"]> {
		const [timeoutExpr, defExpr, showExpr, message] = this.arg.get();
		const timeout = timeoutExpr.reduce(vm);
		assert.number(timeout, "1st argument of TONEINPUT should be a number");
		const def = defExpr.reduce(vm);
		assert.number(def, "2nd argument of TONEINPUT should be a number");
		const show = showExpr?.reduce(vm) ?? 0;
		assert.number(show, "3rd argument of TONEINPUT should be a number");

		const input = yield* vm.queue.input(true, timeout, show === 1);

		let value: number;
		if (input == null) {
			if (message != null) {
				yield* vm.queue.printSingle(message);
			}
			value = def;
		} else {
			value = Number(input[0]);
		}
		assert.number(value, "First value of input for TONEINPUT should be a valid number");

		vm.getValue("RESULT").set(vm, value, [0]);

		return null;
	}
}
