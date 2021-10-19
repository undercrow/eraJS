import P from "parsimmon";

import * as E from "../../error";
import * as C from "../../parser/const";
import * as X from "../../parser/expr";
import * as U from "../../parser/util";
import Slice from "../../slice";
import type VM from "../../vm";
import Statement from "../index";
import AssignForm from "./assign-form";
import AssignInt from "./assign-int";
import AssignOpInt from "./assign-op-int";
import AssignOpStr from "./assign-op-str";
import AssignPostfix from "./assign-postfix";
import AssignStr from "./assign-str";

const PARSER_VAR = P.seq(
	X.variable,
	P.alt(
		U.alt("="),
		U.alt("'="),
		U.alt("*=", "/=", "%=", "+=", "-=", "&=", "|=", "^="),
		U.alt("++", "--"),
	).trim(C.WS0),
	P.all,
);
export default class Assign extends Statement {
	public inner?: AssignForm | AssignInt | AssignOpInt | AssignOpStr | AssignPostfix | AssignStr;

	public constructor(raw: Slice) {
		super(raw);
	}

	public *run(vm: VM) {
		if (this.inner == null) {
			const [dest, op, rest] = U.tryParse(PARSER_VAR, this.raw);
			const restSlice = this.raw.slice(this.raw.length() - rest.length);
			const destType = dest.getCell(vm).type;
			if (op === "=" && destType === "number") {
				this.inner = new AssignInt(dest, restSlice);
			} else if (op === "=" && destType === "string") {
				this.inner = new AssignForm(dest, restSlice);
			} else if (op === "'=") {
				this.inner = new AssignStr(dest, restSlice);
			} else if (op === "+=" && destType === "string") {
				this.inner = new AssignOpStr(dest, "+=", restSlice);
			} else if (op === "++" && destType === "number") {
				this.inner = new AssignPostfix(dest, "++", restSlice);
			} else if (op === "--" && destType === "number") {
				this.inner = new AssignPostfix(dest, "--", restSlice);
			} else if (
				["*=", "/=", "%=", "+=", "-=", "&=", "|=", "^="].includes(op) &&
				destType === "number"
			) {
				this.inner = new AssignOpInt(dest, op as AssignOpInt["operator"], restSlice);
			} else {
				throw E.parser("Invalid assignment expression");
			}
		}

		return yield* vm.run(this.inner);
	}
}
