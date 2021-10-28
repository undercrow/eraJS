import * as assert from "../../assert";
import Character from "../../character";
import * as X from "../../parser/expr";
import * as U from "../../parser/util";
import {savefile, GameSave} from "../../savedata";
import Lazy from "../../lazy";
import Slice from "../../slice";
import Int0DValue from "../../value/int-0d";
import Int1DValue from "../../value/int-1d";
import Int2DValue from "../../value/int-2d";
import Int3DValue from "../../value/int-3d";
import Str0DValue from "../../value/str-0d";
import Str1DValue from "../../value/str-1d";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement, {EraGenerator} from "../index";

const PARSER = U.arg1R1(X.expr);
export default class LoadData extends Statement {
	public arg: Lazy<Expr>;

	public constructor(raw: Slice) {
		super(raw);

		this.arg = new Lazy(raw, PARSER);
	}

	public async *run(vm: VM): EraGenerator {
		const index = await this.arg.get().reduce(vm);
		assert.number(index, "Argument of LOADDATA must be a number");

		const file = savefile.game(index);
		const raw = await vm.external.getSavedata(file);
		assert.nonNull(raw, `Save file ${file} does not exist`);
		try {
			const parsed: GameSave = JSON.parse(raw);
			assert.string(parsed.data.comment, "");
			assert.array(parsed.data.characters, "");
			const newCharacters: Character[] = [];
			for (const character of parsed.data.characters) {
				const newCharacter = new Character(vm, {
					no: 0,
					name: "",
					callname: "",
					nickname: "",
					mastername: "",
					base: new Map(),
					maxBase: new Map(),
					mark: new Map(),
					exp: new Map(),
					abl: new Map(),
					talent: new Map(),
					relation: new Map(),
					cflag: new Map(),
					equip: new Map(),
					juel: new Map(),
					cstr: new Map(),
				});
				for (const [name, value] of Object.entries(character)) {
					const cell = newCharacter.getValue(name);
					if (cell instanceof Int0DValue) {
						assert.number(value, "");
						cell.reset(value);
					} else if (cell instanceof Int1DValue) {
						assert.numArray(value, "");
						cell.reset(value);
					} else if (cell instanceof Str0DValue) {
						assert.string(value, "");
						cell.reset(value);
					} else if (cell instanceof Str1DValue) {
						assert.strArray(value, "");
						cell.reset(value);
					}
				}
				newCharacters.push(newCharacter);
			}
			vm.characterList = newCharacters;

			for (const [name, value] of Object.entries(parsed.data.variables)) {
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

			vm.getValue("LASTLOAD_VERSION").set(vm, parsed.version, []);
			vm.getValue("LASTLOAD_TEXT").set(vm, parsed.data.comment, []);
		} catch {
			throw new Error(`Save file ${file} is not in a valid format`);
		}

		return {
			type: "begin",
			keyword: "DATALOADED",
		};
	}
}
