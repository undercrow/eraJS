export default class Slice {
	public file: string;
	// NOTE: `line` is 0-indexed
	public line: number;
	public from: number;
	public to: number;
	public content: string;

	public constructor(
		file: string,
		line: number,
		content: string,
		from?: number,
		to?: number
	) {
		this.file = file;
		this.line = line;
		this.content = content;
		this.from = from ?? 0;
		this.to = to ?? content.length;
	}

	public slice(from?: number, to?: number): Slice {
		const newFrom = this.from + (from ?? 0);
		let newTo: number;
		if (to == null) {
			newTo = this.to;
		} else {
			newTo = Math.min(this.to, this.from + to);
		}
		return new Slice(this.file, this.line, this.content, newFrom, newTo);
	}

	public get(): string {
		return this.content.slice(this.from, this.to);
	}

	public length(): number {
		return this.to - this.from;
	}
}
