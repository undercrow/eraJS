import * as EM from "../../error";
import * as E from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Slice from "../../slice";
import type VM from "../../vm";
import Form from "../expr/form";
import Statement from "../index";

const PARSER = U.arg1R1(E.form[""]);
export default class GotoForm extends Statement {
	public arg: Lazy<Form>;

	public constructor(raw: Slice) {
		super(raw);

		this.arg = new Lazy(raw, PARSER);
	}

	public *run(vm: VM) {
		const target = this.arg.get().reduce(vm).toUpperCase();

		const context = vm.context();
		if (!context.fn.thunk.labelMap.has(target)) {
			throw EM.notFound("Label", target);
		}

		return <const>{
			type: "goto",
			label: target,
		};
	}
}
