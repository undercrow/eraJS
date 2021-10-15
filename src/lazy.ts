import P from "parsimmon";

import * as U from "./parser/util";
import Slice from "./slice";

export default class Lazy<T> {
	public raw: Slice;
	public parser: P.Parser<T>;
	public isCompiled: boolean;
	public cache?: T;

	public constructor(raw: Slice, parser: P.Parser<T>) {
		this.parser = parser;
		this.raw = raw;
		this.isCompiled = false;
	}

	public get(): T {
		if (this.isCompiled) {
			return this.cache!;
		}

		const result = U.tryParse(this.parser, this.raw);
		this.isCompiled = true;
		this.cache = result;

		return result;
	}
}
