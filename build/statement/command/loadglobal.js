import * as assert from "../../assert";
import * as U from "../../parser/util";
import { savefile } from "../../savedata";
import Int0DValue from "../../value/int-0d";
import Int1DValue from "../../value/int-1d";
import Int2DValue from "../../value/int-2d";
import Int3DValue from "../../value/int-3d";
import Str0DValue from "../../value/str-0d";
import Str1DValue from "../../value/str-1d";
import Statement from "../index";
const PARSER = U.arg0R0();
export default class LoadGlobal extends Statement {
    constructor(raw) {
        super(raw);
        U.tryParse(PARSER, raw);
    }
    async *run(vm) {
        const file = savefile.global;
        const raw = await vm.external.getSavedata(file);
        try {
            assert.nonNull(raw, "");
            const parsed = JSON.parse(raw);
            const code = vm.code.csv.gamebase.code ?? 0;
            const version = vm.code.csv.gamebase.version ?? 0;
            assert.cond(parsed.code === code, "");
            assert.cond(parsed.version === version, "");
            for (const [name, value] of Object.entries(parsed.data)) {
                const cell = vm.getValue(name);
                if (cell instanceof Int0DValue) {
                    assert.string(value, "");
                    cell.reset(BigInt(value));
                }
                else if (cell instanceof Int1DValue) {
                    assert.strArray(value, "");
                    cell.reset(value.map((v) => BigInt(v)));
                }
                else if (cell instanceof Int2DValue) {
                    assert.strArray2D(value, "");
                    cell.reset(value.map((v0) => v0.map((v1) => BigInt(v1))));
                }
                else if (cell instanceof Int3DValue) {
                    assert.strArray3D(value, "");
                    cell.reset(value.map((v0) => v0.map((v1) => v1.map((v2) => BigInt(v2)))));
                }
                else if (cell instanceof Str0DValue) {
                    assert.string(value, "");
                    cell.reset(value);
                }
                else if (cell instanceof Str1DValue) {
                    assert.strArray(value, "");
                    cell.reset(value);
                }
                else {
                    throw new Error("");
                }
            }
            vm.getValue("RESULT").set(vm, 1n, [0]);
        }
        catch {
            vm.getValue("RESULT").set(vm, 0n, [0]);
        }
        return null;
    }
}
