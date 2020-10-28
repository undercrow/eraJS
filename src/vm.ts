import {assert, assertNumber} from "./assert";
import type Fn from "./fn";
import type {default as Statement, Result} from "./statement";
import type Alignment from "./statement/command/alignment";

export type Config = {
	gamebase?: {
		author?: string;
		info?: string;
		year?: string;
		title?: string;
		version?: number;
	};
};

type LeafValue = string | number | null;
type Value = LeafValue | LeafValue[] | LeafValue[][] | LeafValue[][][];

type Context = {
	fn: string;
	dynamicMap: Map<string, Value>;
};

export default class VM {
	public fnMap: Map<string, Fn[]>;
	public globalMap: Map<string, Value>;
	public staticMap: Map<string, Map<string, Value>>;
	private contextStack: Array<Context>;

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
		this.globalMap = new Map();
		this.staticMap = new Map();
		this.contextStack = [];
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

		this.globalMap.set("RESULT", Array<null>(1000).fill(null));
		this.globalMap.set("RESULTS", Array<null>(100).fill(null));
		this.globalMap.set("GLOBAL", Array<null>(1000).fill(null));
		this.globalMap.set("GLOBALS", Array<null>(100).fill(null));
		this.globalMap.set("GAMEBASE_AUTHOR", config.gamebase?.author ?? "");
		this.globalMap.set("GAMEBASE_INFO", config.gamebase?.info ?? "");
		this.globalMap.set("GAMEBASE_YEAR", config.gamebase?.year ?? "");
		this.globalMap.set("GAMEBASE_TITLE", config.gamebase?.title ?? "");
		this.globalMap.set("GAMEBASE_VERSION", config.gamebase?.version ?? 0);
		this.globalMap.set("LINECOUNT", 0);

		for (const fn of this.fnMap.keys()) {
			this.staticMap.set(fn, new Map());
			this.staticMap.get(fn)!.set("LOCAL", Array<null>(1000).fill(null));
			this.staticMap.get(fn)!.set("LOCALS", Array<null>(100).fill(null));
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
		context.dynamicMap.set("ARG", Array<null>(1000).fill(null));
		context.dynamicMap.set("ARGS", Array<null>(100).fill(null));
		for (const [name, size] of fn.variableMap) {
			if (size.length === 0) {
				context.dynamicMap.set(name, null);
			} else if (size.length === 1) {
				context.dynamicMap.set(name, Array.from({length: size[0]}, () => null));
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

		if (context.dynamicMap.has(name)) {
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


		if (context.dynamicMap.has(name)) {
			update(context.dynamicMap);
		} else if (this.staticMap.get(context.fn)!.has(name)) {
			update(this.staticMap.get(context.fn)!);
		} else if (this.globalMap.has(name)) {
			update(this.globalMap);
		} else {
			throw new Error(`Variable ${name} does not exist`);
		}
	}

	public *eval(statementList: Statement[]): ReturnType<Statement["run"]> {
		for (const statement of statementList) {
			const result = yield* statement.run(this);
			if (result != null) {
				return result;
			}
		}
		return null;
	}

	public *call(fnName: string): ReturnType<Statement["run"]> {
		assert(this.fnMap.has(fnName), `Function ${fnName} does not exist`);
		for (const fn of this.fnMap.get(fnName)!) {
			this.pushContext(fn);
			const result = yield* this.eval(fn.statement);
			this.popContext();

			if (result != null) {
				return result;
			}
		}
		return null;
	}

	public *start(): ReturnType<Statement["run"]> {
		let begin = "TITLE";
		while (true) {
			let result: Result | null = null;
			switch (begin) {
				case "TITLE": {
					result = yield* this.call("SYSTEM_TITLE");
					break;
				}
				case "FIRST": {
					result = yield* this.call("EVENTFIRST");
					break;
				}
				default: {
					throw new Error(`${begin} is not a valid keyword`);
				}
			}

			switch (result?.type) {
				case "begin": begin = result.keyword; continue;
				case "return": return null;
				case undefined: continue;
			}
		}
	}
}
