import * as assert from "../../assert";
import * as X from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import {savefile, GameSave} from "../../savedata";
import Slice from "../../slice";
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

	public async *run(vm: VM) {
		const index = await this.arg.get().reduce(vm);
		assert.bigint(index, "1st argument of CHKDATA must be a number");

		let result: bigint;
		let message: string = "";
		const file = savefile.game(Number(index));
		const raw = await vm.external.getSavedata(file);
		if (raw == null) {
			result = 1n;
			message = "----";
		} else {
			try {
				const parsed: GameSave = JSON.parse(raw);
				assert.number(parsed.code, `Save file ${file} is not in a valid format`);
				assert.number(parsed.version, `Save file ${file} is not in a valid format`);
				assert.string(parsed.data.comment, `Save file ${file} is not in a valid format`);
				const code = vm.code.csv.gamebase.code ?? 0;
				const version = vm.code.csv.gamebase.version ?? 0;
				if (parsed.code !== code) {
					result = 2n;
					message = "異なるゲームのセーブデータです";
				} else if (parsed.version !== version) {
					result = 3n;
					message = "セーブデータのバーションが異なります";
				} else {
					result = 0n;
					message = parsed.data.comment;
				}
			} catch {
				result = 4n;
				message = "読み込み中にエラーが発生しました";
			}
		}

		vm.getValue("RESULT").set(vm, result, [0]);
		vm.getValue("RESULTS").set(vm, message, [0]);

		return null;
	}
}
