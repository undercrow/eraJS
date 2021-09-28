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
			vm.getValue<StrChar0DValue>("CALLNAME").value.set(charaNum, character.callname);
			vm.getValue<IntChar1DValue>("BASE").reset(vm, charaNum, character.base);
			vm.getValue<IntChar1DValue>("MAXBASE").reset(vm, charaNum, character.maxBase);
			vm.getValue<IntChar1DValue>("ABL").reset(vm, charaNum, character.abilities);
			vm.getValue<IntChar1DValue>("TALENT").reset(vm, charaNum, character.talent);
			vm.getValue<IntChar1DValue>("EXP").reset(vm, charaNum, character.exp);
			vm.getValue<IntChar1DValue>("MARK").reset(vm, charaNum, character.mark);
			vm.getValue<IntChar1DValue>("RELATION").reset(vm, charaNum, []);
			vm.getValue<IntChar1DValue>("JUEL").reset(vm, charaNum, character.juel);
			vm.getValue<IntChar1DValue>("CFLAG").reset(vm, charaNum, character.flags);
			vm.getValue<IntChar1DValue>("EQUIP").reset(vm, charaNum, []);
			vm.getValue<IntChar1DValue>("TEQUIP").reset(vm, charaNum, []);
			vm.getValue<IntChar1DValue>("PALAM").reset(vm, charaNum, character.palam);
			vm.getValue<IntChar1DValue>("STAIN").reset(vm, charaNum, []);
			vm.getValue<IntChar1DValue>("EX").reset(vm, charaNum, []);
			vm.getValue<IntChar1DValue>("SOURCE").reset(vm, charaNum, []);
			vm.getValue<IntChar1DValue>("NOWEX").reset(vm, charaNum, []);
			vm.getValue<IntChar1DValue>("GOTJUEL").reset(vm, charaNum, []);
			vm.getValue<StrChar0DValue>("NICKNAME").value.set(charaNum, character.nickname);
			vm.getValue<StrChar0DValue>("MASTERNAME").value.set(charaNum, character.mastername);
			vm.getValue<IntChar1DValue>("DOWNBASE").reset(vm, charaNum, []);
			vm.getValue<IntChar1DValue>("CUP").reset(vm, charaNum, []);
			vm.getValue<IntChar1DValue>("CDOWN").reset(vm, charaNum, []);
			vm.getValue<IntChar1DValue>("TCVAR").reset(vm, charaNum, []);
			vm.getValue<StrChar1DValue>("CSTR").reset(vm, charaNum, character.cstr);

			vm.getValue("CHARANUM").set(vm, charaNum + 1, []);
		}

		return null;
	}
}
