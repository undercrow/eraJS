import {assertString} from "../../assert";
// import Lazy from "../../lazy";
import type VM from "../../vm";
import type Expr from "../expr";
import Form from "../expr/form";
import Statement from "../index";
import CallF from "./callf";
import CallForm from "./callform";

export default class CallFormF extends Statement {
	public static parse(raw: string): CallFormF {
		const [target, arg] = CallForm.PARSER("(,").tryParse(raw);
		return new CallFormF(target, arg);
	}

	public target: Form;
	public arg: (Expr | undefined)[];

	public constructor(target: Form, arg: CallFormF["arg"]) {
		super();
		this.target = target;
		this.arg = arg;
	}

	public *run(vm: VM) {
		const target = this.target.reduce(vm);
		assertString(target, "1st argument of CALLFORMF must be a string");

		return yield* CallF.exec(vm, target, this.arg);
	}
}
