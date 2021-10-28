import * as assert from "../../assert";
import * as E from "../../error";
import * as X from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Slice from "../../slice";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";

const PARSER = U.arg1R1(X.expr);
export default class DelData extends Statement {
	public arg: Lazy<Expr>;

	public constructor(raw: Slice) {
		super(raw);

		this.arg = new Lazy(raw, PARSER);
	}

	public async *run(vm: VM) {
		const index = await this.arg.get().reduce(vm);
		assert.number(index, "Argument of DELDATA must be a number");

		throw E.notImpl("DELDATA");

		return null;
	}
}
