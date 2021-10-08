import * as assert from "../../assert";
import Lazy from "../../lazy";
import type VM from "../../vm";
import type Expr from "../expr";
import Form from "../expr/form";
import Statement from "../index";
import CallF from "./callf";
import CallForm from "./callform";

export default class CallFormF extends Statement {
	public arg: Lazy<[Form, Array<Expr | undefined>]>;

	public constructor(raw: string) {
		super();
		this.arg = new Lazy(raw, CallForm.PARSER("(,"));
	}

	public *run(vm: VM) {
		const [targetExpr, argExpr] = this.arg.get();
		const target = targetExpr.reduce(vm);
		assert.string(target, "1st argument of CALLFORMF must be a string");

		return yield* CallF.exec(vm, target, argExpr);
	}
}
