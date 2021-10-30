import * as X from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Slice from "../../slice";
import type {Leaf} from "../../value";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";

const PARSER = U.arg1R1(X.expr);
export default class ReturnF extends Statement {
	public arg: Lazy<Expr>;

	public constructor(raw: Slice) {
		super(raw);

		this.arg = new Lazy(raw, PARSER);
	}

	public async *run(vm: VM) {
		return <const>{
			type: "return",
			value: [await this.arg.get().reduce(vm)] as Array<Leaf>,
		};
	}
}
