import type {default as Statement, Output} from "./statement";

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

	private *clearTemp(): ReturnType<Statement["run"]> {
		if (this.isLineTemp) {
			this.buffer.push({type: "clear", count: 1});
			this.buffer.push({type: "newline"});
			this.isLineTemp = false;
			this.isLineEmpty = true;
		}

		return null;
	}

	public *flush(): ReturnType<Statement["run"]> {
		for (const output of this.buffer) {
			yield output;
		}
		this.buffer = [];

		return null;
	}

	public *newline(): ReturnType<Statement["run"]> {
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

		return null;
	}

	public *print(text: string, cell?: "LEFT" | "RIGHT"): ReturnType<Statement["run"]> {
		yield* this.clearTemp();
		if (text.length > 0) {
			this.buffer.push({type: "string", text, cell});
			this.isLineEmpty = false;
		}

		if (this.draw) {
			yield* this.flush();
		}

		return null;
	}

	public *printSingle(text: string): ReturnType<Statement["run"]> {
		if (!this.isLineEmpty) {
			yield* this.newline();
		}
		yield* this.print(text);
		yield* this.newline();

		return null;
	}

	public *button(
		text: string,
		value: string,
		cell?: "LEFT" | "RIGHT",
	): ReturnType<Statement["run"]> {
		yield* this.clearTemp();
		this.buffer.push({type: "button", text, value, cell});
		this.isLineEmpty = false;

		if (this.draw) {
			yield* this.flush();
		}

		return null;
	}

	public *line(value?: string): ReturnType<Statement["run"]> {
		yield* this.clearTemp();
		this.buffer.push({type: "line", value});

		if (this.draw) {
			yield* this.flush();
		}

		this.lineCount += 1;
		this.isLineEmpty = true;

		return null;
	}

	public *clear(count: number): ReturnType<Statement["run"]> {
		if (count > 0) {
			this.buffer.push({type: "clear", count});
			this.lineCount = Math.max(0, this.lineCount - count);
			this.isLineTemp = false;
		}

		if (this.draw) {
			yield* this.flush();
		}

		return null;
	}

	public *wait(force: boolean): ReturnType<Statement["run"]> {
		yield* this.flush();
		yield {type: "wait", force};

		return null;
	}

	public *input(
		numeric: boolean,
		timeout?: number,
		showClock?: boolean,
	): Generator<Output, string | null, string | null> {
		yield* this.flush();
		return yield {type: "input", numeric, timeout, showClock};
	}
}
