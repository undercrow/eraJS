import Fn from "../fn";
import Thunk from "../thunk";
export default function parseERB(content: string, macros: Set<string>): Fn[];
export declare function parseThunk(lines: string[], until?: (l: string) => boolean): [Thunk, string[]];
