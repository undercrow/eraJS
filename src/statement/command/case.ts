import P from "parsimmon";

import * as assert from "../../assert";
import * as E from "../../error";
import {parseThunk} from "../../parser/erb";
import * as C from "../../parser/const";
import * as X from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Slice from "../../slice";
import Thunk from "../../thunk";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";

type Operator = "<" | "<=" | ">" | ">=";
type Condition =
	| {type: "equal"; value: string | bigint}
	| {type: "range"; from: bigint; to: bigint}
	| {type: "compare"; op: Operator; value: bigint};

const CASE = /^CASE\s+/i;
const CASEELSE = /^CASEELSE$/i;
const ENDSELECT = /^ENDSELECT$/i;
const PARSER_EXPR = U.arg1R1(X.expr);
const PARSER_BRANCH = U.argNR0(P.alt(
	P.seqMap(C.Int, P.regex(/TO/i).trim(C.WS1).then(C.Int), (from, to) => ({
		type: "range",
		from: BigInt(from),
		to: BigInt(to),
	})),
	P.seqMap(
		P.regex(/IS/i).then(U.alt("<=", "<", ">=", ">").trim(C.WS0)),
		X.expr,
		(op, value) => ({type: "compare", op, value}),
	),
	C.Int.map((value) => ({type: "equal", value: BigInt(value)})),
	C.Str.map((value) => ({type: "equal", value})),
));
export default class Case extends Statement {
	public static parse(arg: Slice, lines: Slice[], from: number): [Case, number] {
		let index = from + 1;
		const branch: Array<[Slice, Thunk]> = [];
		let def = new Thunk([]);
		while (true) {
			if (lines.length <= index) {
				throw E.parser("Unexpected end of thunk in CASE expression");
			}
			const current = lines[index];
			index += 1;

			if (CASE.test(current.get())) {
				const [thunk, consumed] = parseThunk(
					lines,
					index,
					(l) => CASE.test(l) || CASEELSE.test(l) || ENDSELECT.test(l),
				);
				branch.push([current.slice("CASE".length), thunk]);
				index += consumed;
			} else if (CASEELSE.test(current.get())) {
				const [thunk, consumed] = parseThunk(lines, index, (l) => ENDSELECT.test(l));
				def = thunk;
				index += consumed;
			} else if (ENDSELECT.test(current.get())) {
				return [new Case(arg, branch, def), index - from];
			} else {
				throw E.parser("Unexpected statement in CASE expression");
			}
		}
	}

	public arg: Lazy<Expr>;
	public branch: Array<[Lazy<Condition[]>, Thunk]>;
	public def: Thunk;

	public constructor(raw: Slice, branch: Array<[Slice, Thunk]>, def: Thunk) {
		super(raw);

		this.arg = new Lazy(raw, PARSER_EXPR);
		this.branch = branch.map(([cond, thunk]) => [new Lazy(cond, PARSER_BRANCH), thunk]);
		this.def = def;
	}

	public async *run(vm: VM, label?: string) {
		if (label != null) {
			for (const [, thunk] of this.branch) {
				if (thunk.labelMap.has(label)) {
					return yield* thunk.run(vm, label);
				}
			}
		}

		const value = await this.arg.get().reduce(vm);

		for (const [cond, expr] of this.branch) {
			const satisfied = cond.get().some((c) => {
				switch (c.type) {
					case "equal": return c.value === value;
					case "range": return c.from <= value && value <= c.to;
					case "compare": {
						assert.bigint(value, "CASE IS ... should be used for an integer value");
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
