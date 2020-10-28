import type VM from "../../vm";
import strLenS from "../method/strlens";
import type Expr from "./index";

export default class InlineCall implements Expr {
	public name: string;
	public arg: Expr[];

	public constructor(name: string, arg: Expr[]) {
		this.name = name;
		this.arg = arg;
	}

	public reduce(vm: VM): string | number {
		const arg: Array<string | number> = this.arg.map((a) => a.reduce(vm));
		switch (this.name) {
			case "STRLENS": return strLenS(vm, arg);
			default: throw new Error(`Inline call to ${this.name} is not implemented yet`);
		}
	}
}
