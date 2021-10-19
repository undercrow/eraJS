import * as assert from "../../assert";
import * as X from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Dim from "../../property/dim";
import {savefile, GameSave} from "../../savedata";
import Slice from "../../slice";
import Int0DValue from "../../value/int-0d";
import Int1DValue from "../../value/int-1d";
import Int2DValue from "../../value/int-2d";
import Int3DValue from "../../value/int-3d";
import IntChar0DValue from "../../value/int-char-0d";
import IntChar1DValue from "../../value/int-char-1d";
import Str0DValue from "../../value/str-0d";
import Str1DValue from "../../value/str-1d";
import StrChar0DValue from "../../value/str-char-0d";
import StrChar1DValue from "../../value/str-char-1d";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";

/* eslint-disable array-element-newline */
export const whitelist = [
	"DAY", "MONEY", "ITEM", "FLAG", "TFLAG", "UP", "PALAMLV", "EXPLV", "EJAC",
	"DOWN", "RESULT", "COUNT", "TARGET", "ASSI", "MASTER", "NOITEM", "LOSEBASE",
	"SELECTCOM", "PREVCOM", "TIME", "ITEMSALES", "PLAYER", "NEXTCOM", "PBAND",
	"BOUGHT",
	"A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O",
	"P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
	"RANDDATA",
	"SAVESTR",
	"TSTR",
	"ISASSI", "NO",
	"BASE", "MAXBASE", "ABL", "TALENT", "EXP", "MARK", "PALAM", "SOURCE", "EX",
	"CFLAG", "JUEL", "RELATION", "EQUIP", "TEQUIP", "STAIN", "GOTJUEL", "NOWEX",
	"DOWNBASE", "CUP", "CDOWN", "TCVAR",
	"NAME", "CALLNAME", "NICKNAME", "MASTERNAME",
	"CSTR",
	// "CDFLAG",
	"DITEMTYPE", "DA", "DB", "DC", "DD", "DE",
	"TA", "TB",
];
/* eslint-enable array-element-newline */

const PARSER = U.arg2R2(X.expr, X.expr);
export default class SaveData extends Statement {
	public arg: Lazy<[Expr, Expr]>;

	public constructor(raw: Slice) {
		super(raw);

		this.arg = new Lazy(raw, PARSER);
	}

	public *run(vm: VM) {
		const [indexExpr, commentExpr] = this.arg.get();

		const index = indexExpr.reduce(vm);
		assert.number(index, "1st argument of SAVEDATA must be a number");
		const comment = commentExpr.reduce(vm);
		assert.string(comment, "2nd argument of SAVEDATA must be a string");

		const saveData: GameSave = {
			code: vm.getValue<Int0DValue>("GAMEBASE_GAMECODE").get(vm, []),
			version: vm.getValue<Int0DValue>("GAMEBASE_VERSION").get(vm, []),
			data: {
				comment,
				characters: [],
				variables: {},
			},
		};
		for (let i = 0; i < vm.characterList.length; ++i) {
			saveData.data.characters.push({});
		}

		for (const name of whitelist) {
			const cell = vm.getValue(name);
			if (
				cell instanceof Int0DValue ||
				cell instanceof Int1DValue ||
				cell instanceof Int2DValue ||
				cell instanceof Int3DValue ||
				cell instanceof Str0DValue ||
				cell instanceof Str1DValue
			) {
				saveData.data.variables[name] = cell.value;
			} else if (
				cell instanceof IntChar0DValue ||
				cell instanceof IntChar1DValue ||
				cell instanceof StrChar0DValue ||
				cell instanceof StrChar1DValue
			) {
				for (let i = 0; i < vm.characterList.length; ++i) {
					const characterCell = vm.characterList[i].getValue(name);
					saveData.data.characters[i][name] = characterCell.value;
				}
			}
		}

		for (const property of vm.code.header) {
			if (property instanceof Dim && property.isSave() && !property.isGlobal()) {
				const cell = vm.getValue(property.name);
				if (
					cell instanceof Int0DValue ||
					cell instanceof Int1DValue ||
					cell instanceof Int2DValue ||
					cell instanceof Int3DValue ||
					cell instanceof Str0DValue ||
					cell instanceof Str1DValue
				) {
					saveData.data.variables[property.name] = cell.value;
				} else if (
					cell instanceof IntChar0DValue ||
					cell instanceof IntChar1DValue ||
					cell instanceof StrChar0DValue ||
					cell instanceof StrChar1DValue
				) {
					for (let i = 0; i < vm.characterList.length; ++i) {
						const characterCell = vm.characterList[i].getValue(name);
						saveData.data.characters[i][name] = characterCell.value;
					}
				}
			}
		}
		vm.external.setSavedata(savefile.game(index), JSON.stringify(saveData));

		return null;
	}
}
