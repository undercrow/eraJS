import * as E from "../../error";
import * as X from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Slice from "../../slice";
import type VM from "../../vm";
import Form from "../expr/form";
import Statement from "../index";

const PARSER = U.arg1R1(X.form[""]);
export default class GotoForm extends Statement {
	public arg: Lazy<Form>;

	public constructor(raw: Slice) {
		super(raw);

		this.arg = new Lazy(raw, PARSER);
	}

	public async *run(vm: VM) {
		const arg = await this.arg.get().reduce(vm);
		const target = arg.toUpperCase();

		const context = vm.context();
		if (!context.fn.thunk.labelMap.has(target)) {
			throw E.notFound("Label", target);
		}

		return <const>{
			type: "goto",
			label: target,
		};
	}
}
