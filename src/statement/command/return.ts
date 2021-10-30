import * as X from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Slice from "../../slice";
import type {Leaf} from "../../value";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";

const PARSER = U.argNR0(X.expr);
export default class Return extends Statement {
	public arg: Lazy<Expr[]>;

	public constructor(raw: Slice) {
		super(raw);

		this.arg = new Lazy(raw, PARSER);
	}

	public async *run(vm: VM) {
		const result: Array<Leaf> = [];
		for (const expr of this.arg.get()) {
			result.push(await expr.reduce(vm));
		}

		return <const>{
			type: "return",
			value: result,
		};
	}
}
