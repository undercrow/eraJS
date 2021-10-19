import * as assert from "../../assert";
import Character from "../../character";
import * as X from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Slice from "../../slice";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";

const PARSER = U.argNR0(X.expr);
export default class AddChara extends Statement {
	public arg: Lazy<Expr[]>;

	public constructor(raw: Slice) {
		super(raw);

		this.arg = new Lazy(raw, PARSER);
	}

	public *run(vm: VM) {
		for (const expr of this.arg.get()) {
			const id = expr.reduce(vm);
			assert.number(id, "Character id should be an integer");

			const template = vm.templateMap.get(id);
			assert.cond(template != null, `Character template with id ${id} does not exist`);

			vm.characterList.push(new Character(vm, template));
			const charaNum = vm.getValue("CHARANUM").get(vm, []) as number;
			vm.getValue("CHARANUM").set(vm, charaNum + 1, []);
		}

		return null;
	}
}
