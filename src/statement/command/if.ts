import {assertNumber} from "../../assert";
import {parseThunk} from "../../erb/erb";
import * as E from "../../erb/expr";
import * as U from "../../erb/util";
import Lazy from "../../lazy";
import Thunk from "../../thunk";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";

const IF = /^IF\s+/i;
const ELSEIF = /^ELSEIF\s+/i;
const ELSE = /^ELSE$/i;
const ENDIF = /^ENDIF$/i;
export default class If extends Statement {
	public static parse(lines: string[]): [If, string[]] {
		let rest = lines.slice();
		const ifThunk: Array<[string, Thunk]> = [];
		let elseThunk = new Thunk([]);
		while (true) {
			const current = rest.shift();
			if (current == null) {
				throw new Error("Unexpected end of thunk!");
			}

			if (IF.test(current)) {
				const [thunk, restT] = parseThunk(
					rest,
					(l) => ELSEIF.test(l) || ELSE.test(l) || ENDIF.test(l),
				);
				ifThunk.push([current.slice("IF".length), thunk]);
				rest = restT;
			} else if (ELSEIF.test(current)) {
				const [thunk, restT] = parseThunk(
					rest,
					(l) => ELSEIF.test(l) || ELSE.test(l) || ENDIF.test(l),
				);
				ifThunk.push([current.slice("ELSEIF".length), thunk]);
				rest = restT;
			} else if (ELSE.test(current)) {
				[elseThunk, rest] = parseThunk(rest, (l) => ENDIF.test(l));
			} else if (ENDIF.test(current)) {
				return [new If(ifThunk, elseThunk), rest];
			} else {
				throw new Error("Unexpected statement found while parsing IF statement");
			}
		}
	}

	public ifThunk: Array<[Lazy<Expr>, Thunk]>;
	public elseThunk: Thunk;

	public constructor(ifThunk: Array<[string, Thunk]>, elseThunk: Thunk) {
		super();
		this.ifThunk = ifThunk.map(([cond, thunk]) => [
			new Lazy(cond, U.arg1R1(E.expr)),
			thunk,
		]);
		this.elseThunk = elseThunk;
	}

	public *run(vm: VM, label?: string) {
		if (label != null) {
			for (const [, thunk] of this.ifThunk) {
				if (thunk.labelMap.has(label)) {
					return yield* thunk.run(vm, label);
				}
			}
			if (this.elseThunk.labelMap.has(label)) {
				return yield* this.elseThunk.run(vm, label);
			}
		}

		for (let i = 0; i < this.ifThunk.length; ++i) {
			const [cond, thunk] = this.ifThunk[i];
			const condValue = cond.get().reduce(vm);
			assertNumber(condValue, "Condition should be an integer");
			if (condValue !== 0) {
				return yield* thunk.run(vm);
			}
		}

		return yield* this.elseThunk.run(vm);
	}
}
