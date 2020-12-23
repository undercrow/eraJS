import {assertString} from "../../assert";
import * as E from "../../erb/expr";
import * as U from "../../erb/util";
import type VM from "../../vm";
import type Expr from "../expr";
import Const from "../expr/const";
import Statement from "../index";
import Print from "./print";

const DATA = /^DATA\s+/i;
const DATAFORM = /^DATAFORM\s+/i;
const DATALIST = /^DATALIST$/i;
const ENDLIST = /^ENDLIST$/i;
const ENDDATA = /^ENDDATA$/i;
export default class PrintData extends Statement {
	public static parse(postfix: string, lines: string[]): [PrintData, string[]] {
		const rest = lines.slice();
		const data: Expr[] = [];
		while (true) {
			const current = rest.shift();
			if (current == null) {
				throw new Error("Unexpected end of thunk!");
			}

			if (DATA.test(current)) {
				data.push(new Const(U.arg1R1(U.charSeq()).tryParse(current.slice("DATA".length))));
			} else if (DATAFORM.test(current)) {
				data.push(U.arg1R1(E.form[""]).tryParse(current.slice("DATAFORM".length)));
			} else if (DATALIST.test(current) || ENDLIST.test(current)) {
				// Do nothing
			} else if (ENDDATA.test(current)) {
				return [new PrintData(postfix, data), rest];
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

		const index = Math.floor(Math.random() * this.data.length);
		const value = this.data[index].reduce(vm);
		assertString(value, "Item of PRINTDATA must be a string");

		yield* Print.print(vm, value);
		yield* Print.runPostfix(vm, this.postfix);

		return null;
	}
}
