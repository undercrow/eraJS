import {assertNumber, assertString} from "../assert";
import * as E from "../erb/expr";
import Lazy from "../lazy";
import type VM from "../vm";
import Expr from "./expr";
import Variable from "./expr/variable";
import Statement from "./index";

type Operator = "*" | "/" | "%" | "+" | "-" | "&" | "|" | "^";
export default class OpAssign extends Statement {
	public dest: Variable;
	public operator: Operator;
	public expr: Lazy<Expr>;

	public constructor(dest: Variable, operator: Operator, expr: string) {
		super();
		this.dest = dest;
		this.operator = operator;
		this.expr = new Lazy(expr, E.expr);
	}

	public *run(vm: VM) {
		const dest = vm.getValue(this.dest.name);
		const index = this.dest.reduceIndex(vm);

		if (dest.type === "number") {
			const original = dest.get(vm, index) as number;
			const value = this.expr.get().reduce(vm);
			assertNumber(value, `Right operand of ${this.operator}= should be an integer`);

			switch (this.operator) {
				case "*": dest.set(vm, original * value, index); break;
				case "/": dest.set(vm, Math.floor(original / value), index); break;
				case "%": dest.set(vm, original % value, index); break;
				case "+": dest.set(vm, original + value, index); break;
				case "-": dest.set(vm, original - value, index); break;
				// eslint-disable-next-line no-bitwise
				case "&": dest.set(vm, original & value, index); break;
				// eslint-disable-next-line no-bitwise
				case "|": dest.set(vm, original | value, index); break;
				// eslint-disable-next-line no-bitwise
				case "^": dest.set(vm, original ^ value, index); break;
			}
		} else {
			const original = dest.get(vm, index) as string;
			const value = this.expr.get().reduce(vm);
			assertString(value, `Right operand of ${this.operator}= should be a string`);

			switch (this.operator) {
				case "+": dest.set(vm, original + value, index); break;
				default: throw new Error(`Type of operands for ${this.operator} is invalid`);
			}
		}

		return null;
	}
}
