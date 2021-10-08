import P from "parsimmon";

import * as assert from "../../assert";
import * as E from "../../erb/expr";
import * as U from "../../erb/util";
import Lazy from "../../lazy";
import type VM from "../../vm";
import type Expr from "../expr";
import Form from "../expr/form";
import Statement from "../index";
import Call from "./call";

export default class CallForm extends Statement {
	public static PARSER(exclude: keyof (typeof E.form)) {
		return P.alt<[Form, Array<Expr | undefined>]>(
			U.arg1R1(P.seq(E.form[exclude], U.wrap("(", ")", U.sepBy0(",", U.optional(E.expr))))),
			U.argNR1(E.form[exclude], U.optional(E.expr)).map(([f, ...r]) => [f, r]),
		);
	}

	public arg: Lazy<[Form, Array<Expr | undefined>]>;

	public constructor(raw: string) {
		super();
		this.arg = new Lazy(raw, CallForm.PARSER("(,"));
	}

	public *run(vm: VM) {
		const [targetExpr, argExpr] = this.arg.get();
		const target = targetExpr.reduce(vm);
		assert.string(target, "1st argument of CALLFORM must be a string");

		return yield* Call.exec(vm, target, argExpr);
	}
}
