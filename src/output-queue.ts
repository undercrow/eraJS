import type {EraGenerator, Output} from "./statement";

export default class OutputQueue {
	public buffer: Output[];
	public lineCount: number;
	public draw: boolean;
	public skipDisp: boolean;
	public isLineEmpty: boolean;
	public isLineTemp: boolean;

	public constructor() {
		this.buffer = [];
		this.lineCount = 0;
		this.draw = true;
		this.skipDisp = false;
		this.isLineEmpty = true;
		this.isLineTemp = false;
	}

	private *clearTemp(): EraGenerator<void> {
		if (this.isLineTemp) {
			this.buffer.push({type: "clear", count: 1});
			this.buffer.push({type: "newline"});
			this.isLineTemp = false;
			this.isLineEmpty = true;
		}
	}

	public *flush(): EraGenerator<void> {
		for (const output of this.buffer) {
			yield output;
		}
		this.buffer = [];
	}

	public *newline(): EraGenerator<void> {
		if (this.isLineTemp) {
			this.buffer.push({type: "clear", count: 1});
			this.lineCount -= 1;
		}
		this.buffer.push({type: "newline"});
		this.lineCount += 1;
		this.isLineTemp = false;
		this.isLineEmpty = true;

		if (this.draw) {
			yield* this.flush();
		}
	}

	public *print(text: string, cell?: "LEFT" | "RIGHT"): EraGenerator<void> {
		yield* this.clearTemp();
		if (text.length > 0) {
			this.buffer.push({type: "string", text, cell});
			this.isLineEmpty = false;
		}

		if (this.draw) {
			yield* this.flush();
		}
	}

	public *printSingle(text: string): EraGenerator<void> {
		if (!this.isLineEmpty) {
			yield* this.newline();
		}
		yield* this.print(text);
		yield* this.newline();
	}

	public *button(text: string, value: string, cell?: "LEFT" | "RIGHT"): EraGenerator<void> {
		yield* this.clearTemp();
		this.buffer.push({type: "button", text, value, cell});
		this.isLineEmpty = false;

		if (this.draw) {
			yield* this.flush();
		}
	}

	public *line(value?: string): EraGenerator<void> {
		yield* this.clearTemp();
		this.buffer.push({type: "line", value});

		if (this.draw) {
			yield* this.flush();
		}

		this.lineCount += 1;
		this.isLineEmpty = true;
	}

	public *clear(count: number): EraGenerator<void> {
		if (count > 0) {
			this.buffer.push({type: "clear", count});
			this.lineCount = Math.max(0, this.lineCount - count);
			this.isLineTemp = false;
		}

		if (this.draw) {
			yield* this.flush();
		}
	}

	public *wait(force: boolean): EraGenerator<void> {
		yield* this.flush();
		yield {type: "wait", force};
	}

	public *input(
		numeric: boolean,
		timeout?: number,
		showClock?: boolean,
	): EraGenerator<string | null> {
		yield* this.flush();
		return yield {type: "input", numeric, timeout, showClock};
	}
}
