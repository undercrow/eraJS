import * as assert from "../../assert";
import * as E from "../../erb/expr";
import * as U from "../../erb/util";
import Lazy from "../../lazy";
import {savefile, GameSave} from "../../savedata";
import Int0DValue from "../../value/int-0d";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";

const PARSER = U.arg2R2(E.expr, E.expr);
export default class SaveData extends Statement {
	public arg: Lazy<[Expr, Expr]>;

	public constructor(arg: string) {
		super();
		this.arg = new Lazy(arg, PARSER);
	}

	// TODO: save #DIM SAVEDATA variables
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
			},
		};
		for (const character of vm.characterList) {
			const characterData: Record<string, unknown> = {};
			for (const [key, value] of character.values) {
				characterData[key] = value.value;
			}
			saveData.data.characters.push(characterData);
		}
		vm.external.setSavedata(savefile.game(index), JSON.stringify(saveData));

		return null;
	}
}
