import * as assert from "../../assert";
import type Character from "../../character";
import * as X from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Slice from "../../slice";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";

const PARSER = U.argNR1(X.expr, X.expr);
export default class PickupChara extends Statement {
	public arg: Lazy<Expr[]>;

	public constructor(raw: Slice) {
		super(raw);

		this.arg = new Lazy(raw, PARSER);
	}

	public async *run(vm: VM) {
		const argExpr = this.arg.get();
		const arg: bigint[] = [];
		for (let i = 0; i < argExpr.length; ++i) {
			const value = await argExpr[i].reduce(vm);
			assert.bigint(value, `${i + 1}th argument of PICKUPCHARA should be a number`);
			assert.cond(
				value >= 0 && value < vm.characterList.length,
				`${i + 1}th argument of PICKUPCHARA is out of range`,
			);
			arg.push(value);
		}

		let target = -1n;
		let assi = -1n;
		let master = -1n;
		const characterList: Character[] = [];
		for (let i = 0n; i < arg.length; ++i) {
			const index = arg[Number(i)];
			if (index === vm.getValue("TARGET").get(vm, [])) {
				target = i;
			}
			if (index === vm.getValue("ASSI").get(vm, [])) {
				assi = i;
			}
			if (index === vm.getValue("MASTER").get(vm, [])) {
				master = i;
			}
			characterList.push(vm.characterList[Number(i)]);
		}
		vm.getValue("TARGET").set(vm, target, []);
		vm.getValue("ASSI").set(vm, assi, []);
		vm.getValue("MASTER").set(vm, master, []);
		vm.characterList = characterList;

		return null;
	}
}
