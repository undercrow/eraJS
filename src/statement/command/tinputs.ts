import {assertNumber, assertString} from "../../assert";
import * as E from "../../erb/expr";
import * as U from "../../erb/util";
import Lazy from "../../lazy";
import type Expr from "../expr";
import type VM from "../../vm";
import Statement from "../index";

const PARSER = U.arg4R2(E.expr, E.expr, E.expr, U.charSeq());
export default class TInputS extends Statement {
	public arg: Lazy<[Expr, Expr, Expr | undefined, string | undefined]>;

	public constructor(raw: string) {
		super();
		this.arg = new Lazy(raw, PARSER);
	}

	public *run(vm: VM): ReturnType<Statement["run"]> {
		const [timeoutExpr, defExpr, showExpr, message] = this.arg.get();
		const timeout = timeoutExpr.reduce(vm);
		assertNumber(timeout, "1st argument of TINPUTS should be a number");
		const def = defExpr.reduce(vm);
		assertString(def, "2nd argument of TINPUTS should be a string");
		const show = showExpr?.reduce(vm) ?? 0;
		assertNumber(show, "3rd argument of TINPUTS should be a number");

		const input = yield <const>{
			type: "input",
			numeric: false,
			timeout,
			showClock: show === 1,
		};

		let value: string;
		if (input == null) {
			if (message != null) {
				yield* vm.printSingle(message);
			}
			value = def;
		} else {
			value = input;
		}

		vm.getValue("RESULTS").set(vm, value, [0]);

		return null;
	}
}
