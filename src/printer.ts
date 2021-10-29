import type {Chunk, EraGenerator, Output} from "./statement";

export type PrintFlag = "K" | "D" | "W" | "L" | "S";

export default class Printer {
	public buffer: Output[];
	public chunks: Chunk[];
	public align: "LEFT" | "CENTER" | "RIGHT";
	public font: {
		name: string;
		bold: boolean;
		italic: boolean;
		strike: boolean;
		underline: boolean;
	};
	public defaultBackground: string;
	public defaultColor: string;
	public background: string;
	public color: string;
	public focus: string;
	public lineCount: number;
	public draw: boolean;
	public skipDisp: boolean;
	public isLineTemp: boolean;

	public constructor() {
		this.buffer = [];
		this.chunks = [];
		this.align = "LEFT";
		this.font = {
			name: "",
			bold: false,
			italic: false,
			strike: false,
			underline: false,
		};
		this.defaultBackground = "000000";
		this.defaultColor = "FFFFFF";
		this.background = this.defaultBackground;
		this.color = this.defaultColor;
		this.focus = "FFFF00";
		this.lineCount = 0;
		this.draw = true;
		this.skipDisp = false;
		this.isLineTemp = false;
	}

	// eslint-disable-next-line @typescript-eslint/require-await
	private async *clearTemp(): EraGenerator<void> {
		if (this.isLineTemp) {
			this.buffer.push({type: "clear", count: 1});
			this.isLineTemp = false;
		}
	}

	// eslint-disable-next-line @typescript-eslint/require-await
	public async *flush(): EraGenerator<void> {
		for (const output of this.buffer) {
			yield output;
		}
		this.buffer = [];
	}

	public async *newline(): EraGenerator<void> {
		if (this.isLineTemp) {
			this.buffer.push({type: "clear", count: 1});
			this.lineCount -= 1;
		}
		this.buffer.push({
			type: "content",
			align: this.align,
			children: this.chunks,
		});
		this.chunks = [];

		this.lineCount += 1;
		this.isLineTemp = false;

		if (this.draw) {
			yield* this.flush();
		}
	}

	public async *print(
		text: string,
		flags: Set<PrintFlag>,
		cell?: "LEFT" | "RIGHT",
	): EraGenerator<void> {
		yield* this.clearTemp();

		if (flags.has("S") && this.chunks.length > 0) {
			yield* this.newline();
		}

		if (text.length > 0) {
			this.chunks.push({
				type: "string",
				text,
				cell,
				style: {
					color: this.color,
					font: this.font.name,
					bold: this.font.bold,
					italic: this.font.italic,
					strike: this.font.strike,
					underline: this.font.underline,
				},
			});
		}

		if (flags.has("S") || flags.has("L") || flags.has("W")) {
			yield* this.newline();
		}
		if (flags.has("W")) {
			yield* this.wait(false);
		}

		if (this.draw) {
			yield* this.flush();
		}
	}

	public async *button(text: string, value: string, cell?: "LEFT" | "RIGHT"): EraGenerator<void> {
		yield* this.clearTemp();
		this.chunks.push({
			type: "button",
			text,
			value,
			cell,
			style: {
				color: this.color,
				focus: this.focus,
				font: this.font.name,
				bold: this.font.bold,
				italic: this.font.italic,
				strike: this.font.strike,
				underline: this.font.underline,
			},
		});

		if (this.draw) {
			yield* this.flush();
		}
	}

	public async *line(value?: string): EraGenerator<void> {
		yield* this.clearTemp();
		this.buffer.push({type: "line", value});

		if (this.draw) {
			yield* this.flush();
		}

		this.lineCount += 1;
	}

	public async *clear(count: number): EraGenerator<void> {
		if (count > 0) {
			this.buffer.push({type: "clear", count});
			this.lineCount = Math.max(0, this.lineCount - count);
			this.isLineTemp = false;
		}

		if (this.draw) {
			yield* this.flush();
		}
	}

	public async *wait(force: boolean): EraGenerator<void> {
		yield* this.flush();
		if (this.chunks.length > 0) {
			yield* this.newline();
		}

		yield {type: "wait", force};
	}

	public async *input(numeric: boolean, nullable: boolean): EraGenerator<string | null> {
		yield* this.flush();
		if (this.chunks.length > 0) {
			yield* this.newline();
		}

		return yield {type: "input", numeric, nullable};
	}

	public async *tinput(
		numeric: boolean,
		timeout: number,
		countdown: boolean,
	): EraGenerator<string | null> {
		yield* this.flush();
		if (this.chunks.length > 0) {
			yield* this.newline();
		}

		return yield {type: "tinput", numeric, timeout, countdown};
	}
}
