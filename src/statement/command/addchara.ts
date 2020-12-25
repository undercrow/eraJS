import {assert, assertNumber} from "../../assert";
import * as E from "../../erb/expr";
import * as U from "../../erb/util";
import Lazy from "../../lazy";
import IntChar0DValue from "../../value/int-char-0d";
import IntChar1DValue from "../../value/int-char-1d";
import StrChar0DValue from "../../value/str-char-0d";
import StrChar1DValue from "../../value/str-char-1d";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";

const PARSER = U.argNR0(E.expr);
export default class AddChara extends Statement {
	public characters: Lazy<Expr[]>;

	public constructor(raw: string) {
		super();
		this.characters = new Lazy(raw, PARSER);
	}

	public *run(vm: VM) {
		for (const expr of this.characters.get()) {
			const id = expr.reduce(vm);
			assertNumber(id, "Character id should be an integer");

			const character = vm.characterMap.get(id);
			assert(character != null, `Character with id ${id} does not exist`);

			const charaNum = vm.getValue("CHARANUM").get(vm, []) as number;
			vm.getValue<IntChar0DValue>("NO").value.set(charaNum, character.id);
			vm.getValue<IntChar0DValue>("ISASSI").value.set(charaNum, 0);
			vm.getValue<StrChar0DValue>("NAME").value.set(charaNum, character.name);
			vm.getValue<StrChar0DValue>("CALLNAME").value.set(charaNum, character.nickname);
			vm.getValue<IntChar1DValue>("BASE").value.set(charaNum, character.base.slice());
			vm.getValue<IntChar1DValue>("MAXBASE").value.set(charaNum, character.maxBase.slice());
			vm.getValue<IntChar1DValue>("ABL").value.set(charaNum, character.abilities.slice());
			vm.getValue<IntChar1DValue>("TALENT").value.set(charaNum, character.talent.slice());
			vm.getValue<IntChar1DValue>("EXP").value.set(charaNum, character.exp.slice());
			vm.getValue<IntChar1DValue>("MARK").value.set(charaNum, character.mark.slice());
			vm.getValue<IntChar1DValue>("RELATION").value.set(
				charaNum,
				Array<number>(vm.getValue<IntChar1DValue>("RELATION").size).fill(0),
			);
			vm.getValue<IntChar1DValue>("JUEL").value.set(charaNum, character.juel.slice());
			vm.getValue<IntChar1DValue>("CFLAG").value.set(charaNum, character.flags.slice());
			vm.getValue<IntChar1DValue>("EQUIP").value.set(
				charaNum,
				Array<number>(vm.getValue<IntChar1DValue>("EQUIP").size).fill(0),
			);
			vm.getValue<IntChar1DValue>("TEQUIP").value.set(
				charaNum,
				Array<number>(vm.getValue<IntChar1DValue>("TEQUIP").size).fill(0),
			);
			vm.getValue<IntChar1DValue>("PALAM").value.set(charaNum, character.palam.slice());
			vm.getValue<IntChar1DValue>("STAIN").value.set(
				charaNum,
				Array<number>(vm.getValue<IntChar1DValue>("STAIN").size).fill(0),
			);
			vm.getValue<IntChar1DValue>("EX").value.set(
				charaNum,
				Array<number>(vm.getValue<IntChar1DValue>("EX").size).fill(0),
			);
			vm.getValue<IntChar1DValue>("SOURCE").value.set(
				charaNum,
				Array<number>(vm.getValue<IntChar1DValue>("SOURCE").size).fill(0),
			);
			vm.getValue<IntChar1DValue>("NOWEX").value.set(
				charaNum,
				Array<number>(vm.getValue<IntChar1DValue>("NOWEX").size).fill(0),
			);
			vm.getValue<IntChar1DValue>("GOTJUEL").value.set(
				charaNum,
				Array<number>(vm.getValue<IntChar1DValue>("GOTJUEL").size).fill(0),
			);
			vm.getValue<StrChar1DValue>("CSTR").value.set(charaNum, character.cstr.slice());

			vm.getValue("CHARANUM").set(vm, charaNum + 1, []);
		}

		return null;
	}
}
