import * as assert from "../../assert";
import * as E from "../../erb/expr";
import * as U from "../../erb/util";
import Lazy from "../../lazy";
import {savefile, BaseSave} from "../../savedata";
import Int0DValue from "../../value/int-0d";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";

const PARSER = U.arg1R1(E.expr);
export default class ChkData extends Statement {
	public arg: Lazy<Expr>;

	public constructor(arg: string) {
		super();
		this.arg = new Lazy(arg, PARSER);
	}

	public *run(vm: VM) {
		const index = this.arg.get().reduce(vm);
		assert.number(index, "1st argument of CHKDATA must be a number");

		let result: number;
		const file = savefile.game(index);
		const raw = vm.external.getSavedata(file);
		if (raw == null) {
			result = 0;
		} else {
			try {
				const parsed: BaseSave = JSON.parse(raw);
				assert.number(parsed.code, `Save file ${file} is not in a valid format`);
				assert.number(parsed.version, `Save file ${file} is not in a valid format`);
				const code = vm.getValue<Int0DValue>("GAMEBASE_GAMECODE").get(vm, []);
				const version = vm.getValue<Int0DValue>("GAMEBASE_VERSION").get(vm, []);
				if (parsed.code !== code) {
					result = 2;
				} else if (parsed.version !== version) {
					result = 3;
				} else {
					result = 0;
				}
			} catch {
				result = 4;
			}
		}

		vm.getValue("RESULT").set(vm, result, [0]);

		return null;
	}
}
