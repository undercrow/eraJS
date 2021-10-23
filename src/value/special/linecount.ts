import * as assert from "../../assert";
import * as E from "../../error";
import type VM from "../../vm";
import type {default as Value, Leaf} from "../index";

export default class LineCountValue implements Value<never> {
	public type = <const>"number";
	public name = <const>"LINECOUNT";
	public value!: never;

	public constructor() {
		// Do nothing
	}

	public reset(): this {
		throw E.internal(`${this.name} cannot be reset`);
	}

	public get(vm: VM, index: number[]): number {
		assert.cond(index.length === 0, "LINECOUNT cannot be indexed");

		return vm.queue.lineCount;
	}

	public set(_vm: VM, _value: Leaf, _index: number[]) {
		throw new Error(`Cannot assign a value to ${this.name}`);
	}

	public rangeSet(_vm: VM, _value: Leaf, _index: number[], _range: [number, number]) {
		throw new Error(`Cannot assign a value to ${this.name}`);
	}

	public length(depth: number): number {
		switch (depth) {
			case 0: return 1;
			default: throw new Error(`${this.name} doesn't have a value at depth ${depth}`);
		}
	}
}
