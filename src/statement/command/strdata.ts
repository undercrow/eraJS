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
import Variable from "../expr/variable";
import Statement from "../index";

const DATA = /^DATA(\s+|$)/i;
const DATAFORM = /^DATAFORM\s+/i;
const DATAFORM_EMPTY = /^DATAFORM$/i;
const DATALIST = /^DATALIST$/i;
const ENDLIST = /^ENDLIST$/i;
const ENDDATA = /^ENDDATA$/i;
const PARSER_ARG = U.arg1R1(X.variable);
const PARSER_CONST = U.arg1R0(C.charSeq()).map((value) => new Const(value ?? ""));
const PARSER_FORM = U.arg1R1(X.form[""]);
export default class StrData extends Statement {
	public static parse(lines: Slice[], from: number): [StrData, number] {
		let index = from + 1;
		const data: Lazy<Expr>[] = [];
		while (true) {
			if (lines.length <= index) {
				throw E.parser("Unexpected end of thunk in STRDATA expression");
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
				return [new StrData(lines[from].slice("STRADATA".length), data), index - from];
			} else {
				throw E.parser("Unexpected statement in STRDATA expression");
			}
		}
	}

	public arg: Lazy<Variable>;
	public data: Lazy<Expr>[];

	public constructor(raw: Slice, data: Lazy<Expr>[]) {
		super(raw);

		this.arg = new Lazy(raw, PARSER_ARG);
		this.data = data;
	}

	public async *run(vm: VM) {
		const dest = this.arg.get();
		const index = vm.random.next() % this.data.length;
		const value = await this.data[index].get().reduce(vm);
		assert.string(value, "Item of STRDATA must be a string");

		dest.getCell(vm).set(vm, value, await dest.reduceIndex(vm));

		return null;
	}
}
