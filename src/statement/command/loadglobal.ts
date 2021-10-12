import * as assert from "../../assert";
import * as U from "../../parser/util";
import {savefile, GlobalSave} from "../../savedata";
import Int0DValue from "../../value/int-0d";
import Int1DValue from "../../value/int-1d";
import Int2DValue from "../../value/int-2d";
import Int3DValue from "../../value/int-3d";
import Str0DValue from "../../value/str-0d";
import Str1DValue from "../../value/str-1d";
import type VM from "../../vm";
import Statement from "../index";

const PARSER = U.arg0R0();
export default class LoadGlobal extends Statement {
	public constructor(arg: string) {
		super();
		PARSER.tryParse(arg);
	}

	public *run(vm: VM) {
		const file = savefile.global;
		const raw = vm.external.getSavedata(file);

		try {
			assert.nonNull(raw, "");
			const parsed: GlobalSave = JSON.parse(raw);
			const code = vm.getValue<Int0DValue>("GAMEBASE_GAMECODE").get(vm, []);
			const version = vm.getValue<Int0DValue>("GAMEBASE_VERSION").get(vm, []);
			assert.cond(parsed.code === code, "");
			assert.cond(parsed.version === version, "");
			for (const [name, value] of Object.entries(parsed.data)) {
				const cell = vm.getValue(name);
				if (cell instanceof Int0DValue) {
					assert.number(value, "");
					cell.reset(value);
				} else if (cell instanceof Int1DValue) {
					assert.numArray(value, "");
					cell.reset(value);
				} else if (cell instanceof Int2DValue) {
					assert.numArray2D(value, "");
					cell.reset(value);
				} else if (cell instanceof Int3DValue) {
					assert.numArray3D(value, "");
					cell.reset(value);
				} else if (cell instanceof Str0DValue) {
					assert.string(value, "");
					cell.reset(value);
				} else if (cell instanceof Str1DValue) {
					assert.strArray(value, "");
					cell.reset(value);
				} else {
					throw new Error("");
				}
			}

			vm.getValue("RESULT").set(vm, 1, [0]);
		} catch {
			vm.getValue("RESULT").set(vm, 0, [0]);
		}

		return null;
	}
}
