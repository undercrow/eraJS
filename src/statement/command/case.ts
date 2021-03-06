import P from "parsimmon";

import {assertNumber} from "../../assert";
import {parseThunk} from "../../erb/erb";
import * as E from "../../erb/expr";
import * as U from "../../erb/util";
import Lazy from "../../lazy";
import Thunk from "../../thunk";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";

type Operator = "<" | "<=" | ">" | ">=";
type Condition =
	| {type: "equal"; value: string | number}
	| {type: "range"; from: number; to: number}
	| {type: "compare"; op: Operator; value: number};

const CASE = /^CASE\s+/i;
const CASEELSE = /^CASEELSE$/i;
const ENDSELECT = /^ENDSELECT$/i;
export default class Case extends Statement {
	public static parse(lines: string[]): [Case, string[]] {
		let rest = lines.slice();
		const expr = rest.shift()!.slice("SELECTCASE".length);
		const branch: Array<[string, Thunk]> = [];
		let def = new Thunk([]);
		while (true) {
			const current = rest.shift();
			if (current == null) {
				throw new Error("Unexpected end of thunk!");
			}

			if (CASE.test(current)) {
				const [thunk, restT] = parseThunk(
					rest,
					(l) => CASE.test(l) || CASEELSE.test(l) || ENDSELECT.test(l),
				);
				branch.push([current.slice("CASE".length), thunk]);
				rest = restT;
			} else if (CASEELSE.test(current)) {
				[def, rest] = parseThunk(rest, (l) => ENDSELECT.test(l));
			} else if (ENDSELECT.test(current)) {
				return [new Case(expr, branch, def), rest];
			} else {
				throw new Error("Unexpected statement found while parsing CASE statement");
			}
		}
	}

	public expr: Lazy<Expr>;
	public branch: Array<[Lazy<Condition[]>, Thunk]>;
	public def: Thunk;

	public constructor(
		expr: string,
		branch: Array<[string, Thunk]>,
		def: Thunk,
	) {
		super();

		const branchParser = U.argNR0(P.alt(
			P.seqMap(U.Int, P.regex(/TO/i).trim(U.WS1).then(U.Int), (from, to) => ({
				type: "range",
				from,
				to,
			})),
			P.seqMap(
				P.regex(/IS/i).then(U.alt("<=", "<", ">=", ">").trim(U.WS0)),
				U.Int,
				(op, value) => ({type: "compare", op, value}),
			),
			U.Int.map((value) => ({type: "equal", value})),
			U.Str.map((value) => ({type: "equal", value})),
		));

		this.expr = new Lazy(expr, U.arg1R1(E.expr));
		this.branch = branch.map(([cond, thunk]) => [new Lazy(cond, branchParser), thunk]);
		this.def = def;
	}

	public *run(vm: VM, label?: string) {
		if (label != null) {
			for (const [, thunk] of this.branch) {
				if (thunk.labelMap.has(label)) {
					return yield* thunk.run(vm, label);
				}
			}
		}

		const value = this.expr.get().reduce(vm);

		for (const [cond, expr] of this.branch) {
			const satisfied = cond.get().some((c) => {
				switch (c.type) {
					case "equal": return c.value === value;
					case "range": return c.from <= value && value <= c.to;
					case "compare": {
						assertNumber(value, "CASE IS ... should be used for an integer value");
						switch (c.op) {
							case "<": return value < c.value;
							case "<=": return value <= c.value;
							case ">": return value > c.value;
							case ">=": return value >= c.value;
						}
					}
				}
			});

			if (satisfied) {
				return yield* expr.run(vm);
			}
		}

		return null;
	}
}
