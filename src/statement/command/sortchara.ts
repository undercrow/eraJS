import * as E from "../../error";
import * as X from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Slice from "../../slice";
import Int1DValue from "../../value/int-1d";
import IntChar0DValue from "../../value/int-char-0d";
import IntChar1DValue from "../../value/int-char-1d";
import StrChar0DValue from "../../value/str-char-0d";
import StrChar1DValue from "../../value/str-char-1d";
import type VM from "../../vm";
import Variable from "../expr/variable";
import Statement from "../index";

const PARSER = U.arg2R0(X.variable, U.alt("FORWARD", "BACK"));
export default class SortChara extends Statement {
	public arg: Lazy<[Variable | undefined, "FORWARD" | "BACK" | undefined]>;

	public constructor(raw: Slice) {
		super(raw);

		this.arg = new Lazy(raw, PARSER);
	}

	public *run(vm: VM) {
		let [varExpr, order] = this.arg.get();
		varExpr = varExpr ?? new Variable("NO", []);
		order = order ?? "FORWARD";

		const cell = varExpr.getCell(vm);
		const target = vm.getValue<Int1DValue>("TARGET").get(vm, []);
		const assi = vm.getValue<Int1DValue>("ASSI").get(vm, []);
		const master = vm.getValue<Int1DValue>("MASTER").get(vm, []);
		const characterList = vm.characterList.map((character, index) => ({character, index}));
		if (master >= 0) {
			characterList.splice(master, 1);
		}

		if (cell instanceof IntChar0DValue) {
			characterList.sort((a, b) => {
				const left = cell.get(vm, [a.index]);
				const right = cell.get(vm, [b.index]);
				const compare = left - right;
				return order === "FORWARD" ? compare : -compare;
			});
		} else if (cell instanceof IntChar1DValue) {
			const index = varExpr.reduceIndex(vm);
			characterList.sort((a, b) => {
				const left = cell.get(vm, [a.index, ...index]);
				const right = cell.get(vm, [b.index, ...index]);
				const compare = left - right;
				return order === "FORWARD" ? compare : -compare;
			});
		} else if (cell instanceof StrChar0DValue) {
			characterList.sort((a, b) => {
				const left = cell.get(vm, [a.index]);
				const right = cell.get(vm, [b.index]);
				const compare = left.localeCompare(right);
				return order === "FORWARD" ? compare : -compare;
			});
		} else if (cell instanceof StrChar1DValue) {
			const index = varExpr.reduceIndex(vm);
			characterList.sort((a, b) => {
				const left = cell.get(vm, [a.index, ...index]);
				const right = cell.get(vm, [b.index, ...index]);
				const compare = left.localeCompare(right);
				return order === "FORWARD" ? compare : -compare;
			});
		} else {
			throw E.misc("Sort key of SORTCHARA is not a character variable");
		}

		for (let i = 0; i < characterList.length; ++i) {
			if (characterList[i].index === target) {
				vm.getValue("TARGET").set(vm, i, []);
			}
			if (characterList[i].index === assi) {
				vm.getValue("ASSI").set(vm, i, []);
			}
		}
		if (master >= 0) {
			characterList.splice(master, 0, {
				character: vm.characterList[master],
				index: -1,
			});
		}
		vm.characterList = characterList.map(({character}) => character);

		return null;
	}
}
