import P from "parsimmon";

import * as E from "../../parser/expr";
import * as U from "../../parser/util";
import type VM from "../../vm";
import Const from "../expr/const";
import Statement from "../index";
import AssignForm from "./assign-form";
import AssignInt from "./assign-int";
import AssignOpInt from "./assign-op-int";
import AssignOpStr from "./assign-op-str";
import AssignStr from "./assign-str";

const PARSER_VAR = P.seq(
	E.variable,
	P.alt(
		U.alt("="),
		U.alt("'="),
		U.alt("*=", "/=", "%=", "+=", "-=", "&=", "|=", "^="),
		U.alt("++", "--"),
	).trim(U.WS0),
	P.any.many().tie(),
);
const PARSER_INT = U.sepBy0(",", E.expr);
const PARSER_FORM = U.sepBy0(",", E.form[","]);
const PARSER_STR = U.sepBy0(",", E.expr);
export default class Assign extends Statement {
	public raw: string;
	public inner?: AssignForm | AssignInt | AssignOpInt | AssignOpStr | AssignStr;

	public constructor(raw: string) {
		super();
		this.raw = raw;
	}

	public *run(vm: VM) {
		if (this.inner == null) {
			const [dest, op, rest] = PARSER_VAR.tryParse(this.raw);
			const destType = dest.getCell(vm).type;
			if (op === "=" && destType === "number") {
				this.inner = new AssignInt(dest, PARSER_INT.tryParse(rest));
			} else if (op === "=" && destType === "string") {
				this.inner = new AssignForm(dest, PARSER_FORM.tryParse(rest));
			} else if (op === "'=") {
				this.inner = new AssignStr(dest, PARSER_STR.tryParse(rest));
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
