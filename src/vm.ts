import {assert, assertNumber} from "./assert";
import type Fn from "./fn";
import type {default as Statement, Result} from "./statement";
import type Alignment from "./statement/command/alignment";
import Call from "./statement/command/call";

type Character = {
	name: string;
	nickname: string;
	flags: number[];
};

export type Config = {
	gamebase?: {
		author?: string;
		info?: string;
		year?: string;
		title?: string;
		version?: number;
	};
	character: Map<number, Character>;
};

type LeafValue = string | number;
type Value = LeafValue | LeafValue[] | LeafValue[][] | LeafValue[][][];

type Context = {
	fn: string;
	dynamicMap: Map<string, Value>;
};

export default class VM {
	public fnMap: Map<string, Fn[]>;
	public characterMap: Map<number, Character>;

	public globalMap: Map<string, Value>;
	public staticMap: Map<string, Map<string, Value>>;
	private contextStack: Array<Context>;

	public characters: Character[];
	public alignment: Alignment["align"];
	public font: {
		name: string;
		bold: boolean;
	};
	public color: {
		front: {
			r: number;
			g: number;
			b: number;
		};
	};

	public constructor(fnList: Fn[], config: Config) {
		this.fnMap = new Map();
		this.characterMap = new Map();
		this.globalMap = new Map();
		this.staticMap = new Map();
		this.contextStack = [];
		this.characters = [];
		this.alignment = "left";
		this.font = {
			name: "",
			bold: false,
		};
		this.color = {
			front: {
				r: 255,
				g: 255,
				b: 255,
			},
		};

		for (const fn of fnList) {
			if (!this.fnMap.has(fn.name)) {
				this.fnMap.set(fn.name, []);
			}
			this.fnMap.get(fn.name)!.push(fn);
		}

		// Reorder functions
		for (const fn of this.fnMap.keys()) {
			this.fnMap.get(fn)!.sort((a, b) => {
				if (a.order === "first") { return -1; }
				if (b.order === "first") { return 1; }
				if (a.order === "last") { return 1; }
				if (b.order === "last") { return -1; }
				return 0;
			});
		}

		for (const [id, character] of config.character) {
			this.characterMap.set(id, character);
		}

		this.globalMap.set("RESULT", Array(1000).fill(0));
		this.globalMap.set("RESULTS", Array(100).fill(""));
		this.globalMap.set("A", 0);
		this.globalMap.set("B", 0);
		this.globalMap.set("C", 0);
		this.globalMap.set("D", 0);
		this.globalMap.set("E", 0);
		this.globalMap.set("F", 0);
		this.globalMap.set("G", 0);
		this.globalMap.set("H", 0);
		this.globalMap.set("I", 0);
		this.globalMap.set("J", 0);
		this.globalMap.set("K", 0);
		this.globalMap.set("L", 0);
		this.globalMap.set("M", 0);
		this.globalMap.set("N", 0);
		this.globalMap.set("O", 0);
		this.globalMap.set("P", 0);
		this.globalMap.set("Q", 0);
		this.globalMap.set("R", 0);
		this.globalMap.set("S", 0);
		this.globalMap.set("T", 0);
		this.globalMap.set("U", 0);
		this.globalMap.set("V", 0);
		this.globalMap.set("W", 0);
		this.globalMap.set("X", 0);
		this.globalMap.set("Y", 0);
		this.globalMap.set("Z", 0);
		this.globalMap.set("COUNT", 0);
		this.globalMap.set("DAY", 0);
		this.globalMap.set("MONEY", 0);
		this.globalMap.set("TARGET", -1);
		this.globalMap.set("FLAG", Array(10000).fill(0));
		this.globalMap.set("ITEMSALES", Array(100).fill(0));
		this.globalMap.set("BOUGHT", 0);
		this.globalMap.set("PBAND", 4);
		this.globalMap.set("GLOBAL", Array(1000).fill(0));
		this.globalMap.set("GLOBALS", Array(100).fill(""));
		this.globalMap.set("GAMEBASE_AUTHOR", config.gamebase?.author ?? "");
		this.globalMap.set("GAMEBASE_INFO", config.gamebase?.info ?? "");
		this.globalMap.set("GAMEBASE_YEAR", config.gamebase?.year ?? "");
		this.globalMap.set("GAMEBASE_TITLE", config.gamebase?.title ?? "");
		this.globalMap.set("GAMEBASE_VERSION", config.gamebase?.version ?? 0);
		this.globalMap.set("LINECOUNT", 0);

		for (const fn of this.fnMap.keys()) {
			this.staticMap.set(fn, new Map());
			this.staticMap.get(fn)!.set("LOCAL", Array(1000).fill(0));
			this.staticMap.get(fn)!.set("LOCALS", Array(100).fill(""));
		}
	}

	private context(): Context {
		return this.contextStack[this.contextStack.length - 1];
	}

	public pushContext(fn: Fn): void {
		const context: Context = {
			fn: fn.name,
			dynamicMap: new Map(),
		};
		context.dynamicMap.set("ARG", Array(1000).fill(0));
		context.dynamicMap.set("ARGS", Array(100).fill(""));
		for (const [name, size] of fn.intVariableMap) {
			if (size.length === 0) {
				context.dynamicMap.set(name, 0);
			} else if (size.length === 1) {
				context.dynamicMap.set(name, Array<number>(size[0]).fill(0));
			} else if (size.length === 2) {
				throw new Error("Local 2D array is not implemented yet");
			} else if (size.length === 3) {
				throw new Error("Local 3D array is not implemented yet");
			}
		}
		for (const [name, size] of fn.stringVariableMap) {
			if (size.length === 0) {
				context.dynamicMap.set(name, "");
			} else if (size.length === 1) {
				context.dynamicMap.set(name, Array<string>(size[0]).fill(""));
			} else if (size.length === 2) {
				throw new Error("Local 2D array is not implemented yet");
			} else if (size.length === 3) {
				throw new Error("Local 3D array is not implemented yet");
			}
		}

		this.contextStack.push(context);
	}

	public popContext(): void {
		this.contextStack.pop();
	}

	public getValue(name: string, ...index: number[]): LeafValue {
		const context = this.context();
		function get(value: Value) {
			if (Array.isArray(value)) {
				assertNumber(index[0], `1st index of variable ${name} should be an integer`);
				const depth1 = value[index[0]];
				if (Array.isArray(depth1)) {
					assertNumber(index[1], `2nd index of variable ${name} should be an integer`);
					const depth2 = depth1[index[1]];
					if (Array.isArray(depth2)) {
						assertNumber(
							index[2],
							`3rd index of variable ${name} should be an integer`,
						);
						return depth2[index[2]];
					} else {
						return depth2;
					}
				} else {
					return depth1;
				}
			} else {
				return value;
			}
		}

		if (name === "CFLAG") {
			assertNumber(index[0], "1st index of variable CFLAG should be an integer");
			assertNumber(index[1], "2nd index of variable CFLAG should be an integer");

			const character = this.characters[index[0]];
			// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
			assert(character != null, `${index[0]}th character does not exist`);

			return character.flags[index[1]];
		} else if (context.dynamicMap.has(name)) {
			return get(context.dynamicMap.get(name)!);
		} else if (this.staticMap.get(context.fn)!.has(name)) {
			return get(this.staticMap.get(context.fn)!.get(name)!);
		} else if (this.globalMap.has(name)) {
			return get(this.globalMap.get(name)!);
		} else {
			throw new Error(`Variable ${name} does not exist`);
		}
	}

	public setValue(value: LeafValue, name: string, ...index: number[]): void {
		const context = this.context();
		function update(map: Map<string, Value>) {
			const dest = map.get(name)!;
			if (Array.isArray(dest)) {
				assertNumber(index[0], `1st index of variable ${name} should be an integer`);
				const depth1 = dest[index[0]];
				if (Array.isArray(depth1)) {
					assertNumber(index[1], `2nd index of variable ${name} should be an integer`);
					const depth2 = depth1[index[1]];
					if (Array.isArray(depth2)) {
						assertNumber(
							index[2],
							`3rd index of variable ${name} should be an integer`,
						);
						depth2[index[2]] = value;
					} else {
						depth1[index[1]] = value;
					}
				} else {
					dest[index[0]] = value;
				}
			} else {
				map.set(name, value);
			}
		}


		if (name === "CFLAG") {
			assertNumber(index[0], "1st index of variable CFLAG should be an integer");
			assertNumber(index[1], "2nd index of variable CFLAG should be an integer");
			assertNumber(value, "Value for CFLAG should be an integer");

			const character = this.characters[index[0]];
			// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
			assert(character != null, `${index[0]}th character does not exist`);

			character.flags[index[1]] = value;
		} else if (context.dynamicMap.has(name)) {
			update(context.dynamicMap);
		} else if (this.staticMap.get(context.fn)!.has(name)) {
			update(this.staticMap.get(context.fn)!);
		} else if (this.globalMap.has(name)) {
			update(this.globalMap);
		} else {
			throw new Error(`Variable ${name} does not exist`);
		}
	}

	public *start(): ReturnType<Statement["run"]> {
		let begin = "TITLE";
		while (true) {
			let result: Result | null = null;
			switch (begin) {
				case "TITLE": {
					result = yield* new Call("SYSTEM_TITLE", []).run(this);
					break;
				}
				case "FIRST": {
					result = yield* new Call("EVENTFIRST", []).run(this);
					break;
				}
				default: {
					throw new Error(`${begin} is not a valid keyword`);
				}
			}

			switch (result?.type) {
				case "begin": begin = result.keyword; continue;
				case "break": return null;
				case "continue": return null;
				case undefined: continue;
			}
		}
	}
}
