import {assert} from "../assert";
import type VM from "../vm";
import type {default as Value, Leaf} from "./index";

export default class RandValue implements Value {
	public type = <const>"number";

	public get(vm: VM, index: number[]): number {
		assert(index.length === 1, "RAND must be indexed by 1 value");

		return Math.floor(vm.random.next() % index[0]);
	}

	public set(_vm: VM, _value: Leaf, _index: number[]) {
		throw new Error("Cannot assign a value to RAND");
	}

	public length(_depth: number): number {
		throw new Error("Cannot get the length of RAND");
	}
}
