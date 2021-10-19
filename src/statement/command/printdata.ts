import * as assert from "../../assert";
import * as E from "../../error";
import * as C from "../../parser/const";
import * as X from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Slice from "../../slice";
import type VM from "../../vm";
import type Expr from "../expr";
import Const from "../expr/const";
import Statement from "../index";
import Print from "./print";

const DATA = /^DATA(\s+|$)/i;
const DATAFORM = /^DATAFORM\s+/i;
const DATAFORM_EMPTY = /^DATAFORM$/i;
const DATALIST = /^DATALIST$/i;
const ENDLIST = /^ENDLIST$/i;
const ENDDATA = /^ENDDATA$/i;
const PARSER_CONST = U.arg1R0(C.charSeq()).map((value) => new Const(value ?? ""));
const PARSER_FORM = U.arg1R1(X.form[""]);
export default class PrintData extends Statement {
	public static parse(postfix: string, lines: Slice[], from: number): [PrintData, number] {
		let index = from + 1;
		const data: Lazy<Expr>[] = [];
		while (true) {
			if (lines.length <= index) {
				throw E.parser("Unexpected end of thunk in PRINTDATA expression");
			}
			const current = lines[index];
			index += 1;

			if (DATA.test(current.content)) {
				data.push(new Lazy(current.slice("DATA".length), PARSER_CONST));
			} else if (DATAFORM.test(current.content)) {
				data.push(new Lazy(current.slice("DATAFORM".length), PARSER_FORM));
			} else if (DATAFORM_EMPTY.test(current.content)) {
				// TODO: Refactor this part
				data.push(new Lazy(current.slice("DATAFORM".length), PARSER_CONST));
			} else if (DATALIST.test(current.content) || ENDLIST.test(current.content)) {
				// Do nothing
			} else if (ENDDATA.test(current.content)) {
				return [new PrintData(lines[from], postfix, data), index - from];
			} else {
				throw E.parser("Unexpected statement in PRINTDATA expression");
			}
		}
	}

	public postfix: string;
	public data: Lazy<Expr>[];

	public constructor(raw: Slice, postfix: string, data: Lazy<Expr>[]) {
		super(raw);

		this.postfix = postfix;
		this.data = data;
	}

	public *run(vm: VM) {
		if (vm.skipDisp) {
			return null;
		}

		const index = vm.random.next() % this.data.length;
		const value = this.data[index].get().reduce(vm);
		assert.string(value, "Item of PRINTDATA must be a string");

		yield* vm.print(value);
		yield* Print.runPostfix(vm, this.postfix);

		return null;
	}
}
