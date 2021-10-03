export default function preprocess(raw: string, macros: Set<string>): string[] {
	const utf8 = raw.replace(/\uFEFF|\uFFEF/g, "");
	const lines = utf8.replace(/\r|\n/g, "\n").split("\n");
	const fn: Array<(prev: string[]) => string[]> = [
		// Strip comments
		(prev) => prev.map((line) => line.replace(/;.*$/, "")),
		// Trim whitespaces
		(prev) => prev.map((line) => line.trim()),
		// Remove empty lines
		(prev) => prev.filter((line) => line !== ""),
		// Remove [SKIPSTART]~[SKIPEND] and [IF_DEBUG]~[ENDIF] lines
		(prev) => {
			const result: string[] = [];
			let temp = prev.slice();
			while (temp.length > 0) {
				const line = temp.shift()!;
				if (line === "[SKIPSTART]") {
					[, temp] = splitBy(temp, "[SKIPEND]");
				} else if (line === "[IF_DEBUG]") {
					[, temp] = splitBy(temp, "[ENDIF]");
				} else {
					result.push(line);
				}
			}

			return result;
		},
		// Check [IF]/[ENDIF] blocks
		// TODO: Handle [ELSEIF], [ELSE]
		(prev) => {
			let result: string[] = [];
			let temp = prev.slice();
			while (temp.length > 0) {
				const line = temp.shift()!;
				if (/^\[IF .*\]$/.test(line)) {
					const name = line.slice("[IF ".length, -1 * "]".length);
					const [body, rest] = splitBy(temp, "[ENDIF]");
					if (macros.has(name)) {
						result = result.concat(body);
					}
					temp = rest;
				} else {
					result.push(line);
				}
			}

			return result;
		},
		// Concatenate lines inside braces
		(prev) => {
			const result: string[] = [];
			let temp = prev.slice();
			while (temp.length > 0) {
				const line = temp.shift()!;
				if (line === "{") {
					const [group, rest] = splitBy(temp, "}");
					result.push(group.join(""));
					temp = rest;
				} else {
					result.push(line);
				}
			}

			return result;
		},
	];

	return fn.reduce((acc, val) => val(acc), lines);
}

function splitBy(lineList: string[], separator: string): [string[], string[]] {
	const index = lineList.findIndex((line) => line === separator);

	return [lineList.slice(0, index), lineList.slice(index + 1)];
}
