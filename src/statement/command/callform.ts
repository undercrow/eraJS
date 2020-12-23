import P from "parsimmon";

import {assertString} from "../../assert";
import * as E from "../../erb/expr";
import * as U from "../../erb/util";
import type VM from "../../vm";
import type Expr from "../expr";
import Form from "../expr/form";
import Statement from "../index";
import Call from "./call";

export default class CallForm extends Statement {
	public static parse(raw: string): CallForm {
		const [target, arg] = CallForm.compileArg(raw, "(");
		return new CallForm(target, arg);
	}

	public static compileArg(arg: string, exclude: keyof (typeof E.form)): [Form, Expr[]] {
		const parser = P.alt(
			U.arg1R1(P.seq(E.form[exclude], U.wrap("(", U.sepBy0(",", E.expr), ")"))),
			U.argNR1(E.form[exclude], E.expr).map(([f, ...r]) => [f, r]),
		);

		return parser.tryParse(arg) as [Form, Expr[]];
	}

	public target: Form;
	public arg: Expr[];

	public constructor(target: Form, arg: Expr[]) {
		super();
		this.target = target;
		this.arg = arg;
	}

	public *run(vm: VM) {
		const target = this.target.reduce(vm);
		assertString(target, "1st argument of CALLFORM must be a string");

		return yield* new Call(target, this.arg).run(vm);
	}
}
