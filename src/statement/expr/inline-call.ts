import {assert} from "../../assert";
import type VM from "../../vm";
import Assign from "../assign";
import type Expr from "../expr";
import getBgColor from "../method/getbgcolor";
import getBit from "../method/getbit";
import getChara from "../method/getchara";
import getColor from "../method/getcolor";
import getDefBgColor from "../method/getdefbgcolor";
import getDefColor from "../method/getdefcolor";
import getFocusColor from "../method/getfocuscolor";
import inRange from "../method/inrange";
import rand from "../method/rand";
import strLenS from "../method/strlens";
import varSize from "../method/varsize";
import unicode from "../method/unicode";

function runGenerator<T>(gen: Generator<any, T, any>): T {
	while (true) {
		const value = gen.next();
		if (value.done === true) {
			return value.value;
		}
	}
}

export default class InlineCall implements Expr {
	public name: string;
	public arg: Expr[];

	public constructor(name: string, arg: Expr[]) {
		this.name = name.toUpperCase();
		this.arg = arg;
	}

	public reduce(vm: VM): string | number {
		const arg: Array<string | number> = this.arg.map((a) => a.reduce(vm));
		switch (this.name.toUpperCase()) {
			case "GETBGCOLOR": return getBgColor(vm, arg);
			case "GETBIT": return getBit(vm, arg);
			case "GETCHARA": return getChara(vm, arg);
			case "GETCOLOR": return getColor(vm, arg);
			case "GETDEFBGCOLOR": return getDefBgColor(vm, arg);
			case "GETDEFCOLOR": return getDefColor(vm, arg);
			case "GETFOCUSCOLOR": return getFocusColor(vm, arg);
			case "INRANGE": return inRange(vm, arg);
			case "RAND": return rand(vm, arg);
			case "STRLENS": return strLenS(vm, arg);
			case "VARSIZE": return varSize(vm, arg);
			case "UNICODE": return unicode(vm, arg);
			default: {
				assert(vm.fnMap.has(this.name), `Method ${this.name} does not exist`);
				for (const fn of vm.fnMap.get(this.name)!) {
					vm.pushContext(fn);
					for (let i = 0; i < fn.arg.length; ++i) {
						const argExpr = fn.arg[i];
						const value = arg[i];
						if (argExpr instanceof Assign) {
							// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
							if (value != null) {
								const index = argExpr.dest.reduceIndex(vm);
								vm.setValue(value, argExpr.dest.name, ...index);
							} else {
								runGenerator(argExpr.run(vm));
							}
						} else {
							const type = vm.typeof(argExpr.name);
							const fallback = type === "number" ? 0 : "";
							const index = argExpr.reduceIndex(vm);
							// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
							vm.setValue(value ?? fallback, argExpr.name, ...index);
						}
					}

					const result = runGenerator(fn.thunk.run(vm));
					vm.popContext();

					assert(result?.type === "return", "Inline call should return a value");
					return result.value[0];
				}
			}
		}
		throw new Error(`Inline call to ${this.name} is not implemented yet`);
	}
}
