import * as ast from "./ast";

export type Config = {
	gamebase?: {
		author?: string;
		info?: string;
		year?: string;
		title?: string;
		version?: number;
	};
};

export type Program = {
	fn: Partial<Record<string, Array<{
		statement: ast.Statement[];
		local: string[];
	}>>>;
};

export type State = {
	RESULT: Array<number | null>;
	RESULTS: Array<string | null>;
	GLOBAL: Array<number | null>;
	GLOBALS: Array<string | null>;
	GAMEBASE: {
		AUTHOR: string;
		INFO: string;
		YEAR: string;
		TITLE: string;
		VERSION: number;
	};
	LINECOUNT: number;
	globalMap: Map<string, Array<string | number | null>>;
	staticMap: Map<string, Map<string, Array<string | number | null>>>;
	style: {
		alignment: "left" | "center" | "right";
		font: {
			name: string;
			bold: boolean;
		};
		color: {
			front: {
				r: number;
				g: number;
				b: number;
			};
		};
	};
};

export default function compile(fnList: ast.Fn[], config: Config): [Program, State] {
	const program: Program = {
		fn: {},
	};

	for (const fn of fnList) {
		if (!Object.keys(program.fn).includes(fn.name)) {
			program.fn[fn.name] = [];
		}
		program.fn[fn.name]!.push({
			statement: fn.statement,
			local: [],
		});
	}

	const state: State = {
		RESULT: Array<null>(1000).fill(null),
		RESULTS: Array<null>(100).fill(null),
		GLOBAL: Array<null>(1000).fill(null),
		GLOBALS: Array<null>(100).fill(null),
		GAMEBASE: {
			AUTHOR: config.gamebase?.author ?? "",
			INFO: config.gamebase?.info ?? "",
			YEAR: config.gamebase?.year ?? "",
			TITLE: config.gamebase?.title ?? "",
			VERSION: config.gamebase?.version ?? 0,
		},
		LINECOUNT: 0,
		globalMap: new Map(),
		staticMap: new Map(),
		style: {
			alignment: "left",
			font: {
				name: "",
				bold: false,
			},
			color: {
				front: {
					r: 255,
					g: 255,
					b: 255,
				},
			},
		},
	};
	for (const name of Object.keys(program.fn)) {
		state.staticMap.set(name, new Map());
		state.staticMap.get(name)!.set("LOCAL", Array<null>(1000).fill(null));
		state.staticMap.get(name)!.set("LOCALS", Array<null>(100).fill(null));
	}

	return [program, state];
}
