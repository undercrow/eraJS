import * as assert from "../../assert";
import * as X from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Slice from "../../slice";
import Int1DValue from "../../value/int-1d";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";

const PARSER = U.arg1R1(X.expr);
export default class ResetStain extends Statement {
	public arg: Lazy<Expr>;

	public constructor(raw: Slice) {
		super(raw);

		this.arg = new Lazy(raw, PARSER);
	}

	public async *run(vm: VM) {
		const num = await this.arg.get().reduce(vm);
		assert.bigint(num, "1st Argument of RESET_STAIN should be an integer");

		assert.cond(vm.characterList.length > num, `Character #${num} does not exist`);
		const character = vm.characterList[Number(num)];

		character.getValue<Int1DValue>("STAIN").reset([0, 0, 2, 1, 8]);

		return null;
	}
}
