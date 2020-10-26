import * as ast from "./ast";

export type Program = {
	fn: Partial<Record<string, Array<{
		statement: ast.Statement[];
		local: string[];
	}>>>;
};

export default function compile(fnList: ast.Fn[]): Program {
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

	return program;
}
