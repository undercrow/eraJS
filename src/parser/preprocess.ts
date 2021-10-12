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
			let index = 0;
			while (index < prev.length) {
				const line = prev[index];
				if (line === "[SKIPSTART]") {
					index = index + prev.slice(index).indexOf("[SKIPEND]") + 1;
				} else if (line === "[IF_DEBUG]") {
					index = index + prev.slice(index).indexOf("[ENDIF]") + 1;
				} else {
					result.push(line);
					index += 1;
				}
			}

			return result;
		},
		// Check [IF]/[ENDIF] blocks
		// TODO: Handle [ELSEIF], [ELSE]
		(prev) => {
			let result: string[] = [];
			let index = 0;
			while (index < prev.length) {
				const line = prev[index];
				if (/^\[IF .*\]$/.test(line)) {
					const name = line.slice("[IF ".length, -1 * "]".length);
					index += 1;

					const endIndex = index + prev.slice(index).indexOf("[ENDIF]");
					if (macros.has(name)) {
						result = result.concat(line.slice(index, endIndex));
					}
					index = endIndex + 1;
				} else {
					result.push(line);
					index += 1;
				}
			}

			return result;
		},
		// Concatenate lines inside braces
		(prev) => {
			const result: string[] = [];
			let index = 0;
			while (index < prev.length) {
				const line = prev[index];
				if (line === "{") {
					const endIndex = index + prev.slice(index).indexOf("}");
					result.push(prev.slice(index, endIndex).join(""));
					index = endIndex + 1;
				} else {
					result.push(line);
					index += 1;
				}
			}

			return result;
		},
	];

	return fn.reduce((acc, val) => val(acc), lines);
}
