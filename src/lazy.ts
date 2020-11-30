import P from "parsimmon";

export default class Lazy<T> {
	public parser: P.Parser<T>;
	public raw: string;
	public isCompiled: boolean;
	public cache?: T;

	public constructor(raw: string, parser: P.Parser<T>) {
		this.raw = raw;
		this.parser = parser;
		this.isCompiled = false;
	}

	public get(): T {
		if (this.isCompiled) {
			return this.cache!;
		}

		const result = this.parser.tryParse(this.raw);
		this.isCompiled = true;
		this.cache = result;

		return result;
	}
}
