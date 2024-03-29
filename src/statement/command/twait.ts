import * as assert from "../../assert";
import * as X from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Slice from "../../slice";
import type Expr from "../expr";
import type VM from "../../vm";
import Statement, {EraGenerator} from "../index";

const PARSER = U.arg2R2(X.expr, X.expr);
export default class TWait extends Statement {
	public arg: Lazy<[Expr, Expr]>;

	public constructor(raw: Slice) {
		super(raw);

		this.arg = new Lazy(raw, PARSER);
	}

	public async *run(vm: VM): EraGenerator {
		const [timeoutExpr, forceExpr] = this.arg.get();
		const timeout = await timeoutExpr.reduce(vm);
		assert.bigint(timeout, "1st argument of TWAIT should be a number");
		const force = await forceExpr.reduce(vm);
		assert.bigint(force, "2nd argument of TWAIT should be a number");

		yield* vm.printer.wait(force !== 0n);

		return null;
	}
}
