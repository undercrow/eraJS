import type VM from "../../vm";
import getChara from "../method/getchara";
import rand from "../method/rand";
import strLenS from "../method/strlens";
import varSize from "../method/varsize";
import type Expr from "./index";

export default class InlineCall implements Expr {
	public name: string;
	public arg: Expr[];

	public constructor(name: string, arg: Expr[]) {
		this.name = name.toUpperCase();
		this.arg = arg;
	}

	public reduce(vm: VM): string | number {
		const arg: Array<string | number> = this.arg.map((a) => a.reduce(vm));
		switch (this.name) {
			case "GETCHARA": return getChara(vm, arg);
			case "RAND": return rand(vm, arg);
			case "STRLENS": return strLenS(vm, arg);
			case "VARSIZE": return varSize(vm, arg);
			default: throw new Error(`Inline call to ${this.name} is not implemented yet`);
		}
	}
}
