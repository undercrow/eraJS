import {assertString} from "../../assert";
import * as E from "../../erb/expr";
import * as U from "../../erb/util";
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
const PARSER_CONST = U.arg1R0(U.charSeq());
const PARSER_FORM = U.arg1R1(E.form[""]);
export default class PrintData extends Statement {
	public static parse(postfix: string, lines: string[], from: number): [PrintData, number] {
		let index = from + 1;
		const data: Expr[] = [];
		while (true) {
			if (lines.length <= index) {
				throw new Error("Unexpected end of thunk!");
			}
			const current = lines[index];
			index += 1;

			if (DATA.test(current)) {
				data.push(new Const(PARSER_CONST.tryParse(current.slice("DATA".length)) ?? ""));
			} else if (DATAFORM.test(current)) {
				data.push(PARSER_FORM.tryParse(current.slice("DATAFORM".length)));
			} else if (DATAFORM_EMPTY.test(current)) {
				data.push(new Const(""));
			} else if (DATALIST.test(current) || ENDLIST.test(current)) {
				// Do nothing
			} else if (ENDDATA.test(current)) {
				return [new PrintData(postfix, data), index - from];
			} else {
				throw new Error("Unexpected statement found while parsing PRINTDATA statement");
			}
		}
	}

	public postfix: string;
	public data: Expr[];

	public constructor(postfix: string, data: Expr[]) {
		super();
		this.postfix = postfix;
		this.data = data;
	}

	public *run(vm: VM) {
		if (vm.skipDisp) {
			return null;
		}

		const index = vm.random.next() % this.data.length;
		const value = this.data[index].reduce(vm);
		assertString(value, "Item of PRINTDATA must be a string");

		yield* Print.print(vm, value);
		yield* Print.runPostfix(vm, this.postfix);

		return null;
	}
}
