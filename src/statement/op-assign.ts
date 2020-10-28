import {assertNumber} from "../assert";
import type VM from "../vm";
import Expr from "./expr";
import Variable from "./expr/variable";
import Statement from "./index";

type Operator = "*" | "/" | "%" | "+" | "-";
export default class OpAssign extends Statement {
	public dest: Variable;
	public operator: Operator;
	public expr: Expr;

	public constructor(dest: Variable, operator: Operator, expr: Expr) {
		super();
		this.dest = dest;
		this.operator = operator;
		this.expr = expr;
	}

	public *run(vm: VM) {
		const index = this.dest.reduceIndex(vm);
		const original = vm.getValue(this.dest.name, ...index);
		assertNumber(original, `Left operand of ${this.operator}= should be an integer`);
		const value = this.expr.reduce(vm);
		assertNumber(value, `Right operand of ${this.operator}= should be an integer`);

		switch (this.operator) {
			case "*": vm.setValue(original * value, this.dest.name, ...index); break;
			case "/": vm.setValue(Math.floor(original / value), this.dest.name, ...index); break;
			case "%": vm.setValue(original % value, this.dest.name, ...index); break;
			case "+": vm.setValue(original + value, this.dest.name, ...index); break;
			case "-": vm.setValue(original - value, this.dest.name, ...index); break;
		}

		return null;
	}
}
