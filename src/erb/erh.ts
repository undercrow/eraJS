import Property from "../property";
import prop from "./property";

export default function parseERH(content: string): Property[] {
	// Convert \r\n and \r to \n
	const normalized = content.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

	const lineList = normalized.split("\n");

	// Strip comments
	const stripped = lineList.map((line) => line.replace(/;.*$/, ""));

	// Trim leading/trailing whitespaces
	const trimmed = stripped.map((line) => line.replace(/^\s+/, "").replace(/\s+$/, ""));

	// Remove empty lines
	const filtered = trimmed.filter((line) => line !== "");

	// Remove [SKIPSTART]~[SKIPEND] lines
	const processed: string[] = [];
	for (let i = 0; i < filtered.length; ++i) {
		const line = filtered[i];
		if (line === "[SKIPSTART]") {
			for (; i < filtered.length; ++i) {
				if (filtered[i] === "[SKIPEND]") {
					break;
				}
			}
		} else {
			processed.push(line);
		}
	}

	return processed.map((line) => prop.tryParse(line));
}
