import * as assert from "../../assert";
import * as C from "../../parser/const";
import * as X from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Slice from "../../slice";
import type Expr from "../expr";
import type VM from "../../vm";
import Statement, {EraGenerator} from "../index";

const PARSER = U.arg4R2(X.expr, X.expr, X.expr, C.charSeq());
export default class TInput extends Statement {
	public arg: Lazy<[Expr, Expr, Expr | undefined, string | undefined]>;

	public constructor(raw: Slice) {
		super(raw);

		this.arg = new Lazy(raw, PARSER);
	}

	public async *run(vm: VM): EraGenerator {
		const [timeoutExpr, defExpr, showExpr, message] = this.arg.get();
		const timeout = await timeoutExpr.reduce(vm);
		assert.number(timeout, "1st argument of TINPUT should be a number");
		const def = await defExpr.reduce(vm);
		assert.number(def, "2nd argument of TINPUT should be a number");
		const show = await showExpr?.reduce(vm) ?? 0;
		assert.number(show, "3rd argument of TINPUT should be a number");

		const input = yield* vm.printer.tinput(true, timeout, show === 1);

		let value: number;
		if (input == null) {
			if (message != null) {
				yield* vm.printer.print(message, new Set(["S"]));
			}
			value = def;
		} else {
			value = Number(input);
		}
		assert.number(value, "Input value for TINPUT should be a valid number");
		yield* vm.printer.print(value.toString(), new Set(["S"]));

		vm.getValue("RESULT").set(vm, value, [0]);

		return null;
	}
}
