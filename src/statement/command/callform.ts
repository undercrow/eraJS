import P from "parsimmon";

import * as assert from "../../assert";
import * as X from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Slice from "../../slice";
import type VM from "../../vm";
import type Expr from "../expr";
import Form from "../expr/form";
import Statement from "../index";
import Call from "./call";

export default class CallForm extends Statement {
	public static PARSER(exclude: keyof (typeof X.form)) {
		return P.alt<[Form, Array<Expr | undefined>]>(
			U.arg1R1(P.seq(X.form[exclude], U.wrap("(", ")", U.sepBy0(",", U.optional(X.expr))))),
			U.argNR1(X.form[exclude], U.optional(X.expr)).map(([f, ...r]) => [f, r]),
		);
	}

	public arg: Lazy<[Form, Array<Expr | undefined>]>;

	public constructor(raw: Slice) {
		super(raw);

		this.arg = new Lazy(raw, CallForm.PARSER("(,"));
	}

	public *run(vm: VM) {
		const [targetExpr, argExpr] = this.arg.get();
		const target = targetExpr.reduce(vm);
		assert.string(target, "1st argument of CALLFORM must be a string");

		return yield* Call.exec(vm, target, argExpr);
	}
}
