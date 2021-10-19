import * as assert from "../../assert";
import * as X from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import {savefile, GameSave} from "../../savedata";
import Slice from "../../slice";
import Int0DValue from "../../value/int-0d";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";

const PARSER = U.arg1R1(X.expr);
export default class ChkData extends Statement {
	public arg: Lazy<Expr>;

	public constructor(raw: Slice) {
		super(raw);

		this.arg = new Lazy(raw, PARSER);
	}

	public *run(vm: VM) {
		const index = this.arg.get().reduce(vm);
		assert.number(index, "1st argument of CHKDATA must be a number");

		let result: number;
		let message: string = "";
		const file = savefile.game(index);
		const raw = vm.external.getSavedata(file);
		if (raw == null) {
			result = 1;
			message = "----";
		} else {
			try {
				const parsed: GameSave = JSON.parse(raw);
				assert.number(parsed.code, `Save file ${file} is not in a valid format`);
				assert.number(parsed.version, `Save file ${file} is not in a valid format`);
				assert.string(parsed.data.comment, `Save file ${file} is not in a valid format`);
				const code = vm.getValue<Int0DValue>("GAMEBASE_GAMECODE").get(vm, []);
				const version = vm.getValue<Int0DValue>("GAMEBASE_VERSION").get(vm, []);
				if (parsed.code !== code) {
					result = 2;
					message = "異なるゲームのセーブデータです";
				} else if (parsed.version !== version) {
					result = 3;
					message = "セーブデータのバーションが異なります";
				} else {
					result = 0;
					message = parsed.data.comment;
				}
			} catch {
				result = 4;
				message = "読み込み中にエラーが発生しました";
			}
		}

		vm.getValue("RESULT").set(vm, result, [0]);
		vm.getValue("RESULTS").set(vm, message, [0]);

		return null;
	}
}
