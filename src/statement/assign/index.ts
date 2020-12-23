import P from "parsimmon";

import * as E from "../../erb/expr";
import * as U from "../../erb/util";
import type VM from "../../vm";
import Const from "../expr/const";
import Statement from "../index";
import AssignForm from "./assign-form";
import AssignInt from "./assign-int";
import AssignOpInt from "./assign-op-int";
import AssignOpStr from "./assign-op-str";
import AssignStr from "./assign-str";

export default class Assign extends Statement {
	public raw: string;
	public inner?: AssignForm | AssignInt | AssignOpInt | AssignOpStr | AssignStr;

	public constructor(raw: string) {
		super();
		this.raw = raw;
	}

	public *run(vm: VM) {
		if (this.inner == null) {
			const firstParser = P.seq(
				E.variable,
				P.alt(
					U.alt("="),
					U.alt("'="),
					U.alt("*=", "/=", "%=", "+=", "-=", "&=", "|=", "^="),
					U.alt("++", "--"),
				).trim(U.WS0),
				P.any.many().tie(),
			);
			const [dest, op, rest] = firstParser.tryParse(this.raw);
			const destType = vm.getValue(dest.name).type;
			if (op === "=" && destType === "number") {
				this.inner = new AssignInt(dest, U.sepBy0(",", E.expr).tryParse(rest));
			} else if (op === "=" && destType === "string") {
				this.inner = new AssignForm(dest, U.sepBy0(",", E.form[","]).tryParse(rest));
			} else if (op === "'=") {
				this.inner = new AssignStr(dest, U.sepBy0(",", E.expr).tryParse(rest));
			} else if (op === "+=" && destType === "string") {
				this.inner = new AssignOpStr(dest, "+=", E.expr.tryParse(rest));
			} else if (op === "++" && destType === "number") {
				this.inner = new AssignOpInt(dest, "+=", new Const(1));
			} else if (op === "--" && destType === "number") {
				this.inner = new AssignOpInt(dest, "-=", new Const(1));
			} else if (
				["*=", "/=", "%=", "+=", "-=", "&=", "|=", "^="].includes(op) &&
				destType === "number"
			) {
				this.inner = new AssignOpInt(dest, op as any, E.expr.tryParse(rest));
			} else {
				throw new Error("Invalid assignment expression: " + this.raw);
			}
		}

		return yield* this.inner.run(vm);
	}
}
