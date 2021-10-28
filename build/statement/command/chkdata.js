import * as assert from "../../assert";
import * as X from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import { savefile } from "../../savedata";
import Statement from "../index";
const PARSER = U.arg1R1(X.expr);
export default class ChkData extends Statement {
    arg;
    constructor(raw) {
        super(raw);
        this.arg = new Lazy(raw, PARSER);
    }
    async *run(vm) {
        const index = await this.arg.get().reduce(vm);
        assert.number(index, "1st argument of CHKDATA must be a number");
        let result;
        let message = "";
        const file = savefile.game(index);
        const raw = await vm.external.getSavedata(file);
        if (raw == null) {
            result = 1;
            message = "----";
        }
        else {
            try {
                const parsed = JSON.parse(raw);
                assert.number(parsed.code, `Save file ${file} is not in a valid format`);
                assert.number(parsed.version, `Save file ${file} is not in a valid format`);
                assert.string(parsed.data.comment, `Save file ${file} is not in a valid format`);
                const code = vm.getValue("GAMEBASE_GAMECODE").get(vm, []);
                const version = vm.getValue("GAMEBASE_VERSION").get(vm, []);
                if (parsed.code !== code) {
                    result = 2;
                    message = "異なるゲームのセーブデータです";
                }
                else if (parsed.version !== version) {
                    result = 3;
                    message = "セーブデータのバーションが異なります";
                }
                else {
                    result = 0;
                    message = parsed.data.comment;
                }
            }
            catch {
                result = 4;
                message = "読み込み中にエラーが発生しました";
            }
        }
        vm.getValue("RESULT").set(vm, result, [0]);
        vm.getValue("RESULTS").set(vm, message, [0]);
        return null;
    }
}
