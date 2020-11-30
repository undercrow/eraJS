import {assertString} from "../../assert";
import * as E from "../../erb/expr";
import * as U from "../../erb/util";
import Lazy from "../../lazy";
import type VM from "../../vm";
import type Expr from "../expr";
import Const from "../expr/const";
import Statement from "../index";
import Print from "./print";

export default class PrintPlain extends Statement {
	public value: Lazy<Expr>;
	public constructor(postfix: "FORM" | null, raw: string) {
		super();
		switch (postfix) {
			case null: {
				this.value = new Lazy(
					raw,
					U.arg1R0(U.charSeq()).map((str) => new Const(str ?? "")),
				);
				break;
			}
			case "FORM": {
				this.value = new Lazy(
					raw,
					U.arg1R0(E.form()).map((form) => form ?? new Const("")),
				);
			}
		}
	}

	public *run(vm: VM) {
		if (vm.skipDisp) {
			return null;
		}

		const text = this.value.get().reduce(vm);
		assertString(text, "1st argument of PRINTPLAIN must be a string");

		yield* Print.print(vm, text);

		return null;
	}
}
