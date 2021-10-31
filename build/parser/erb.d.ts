import Fn from "../fn";
import Slice from "../slice";
import Thunk from "../thunk";
export default function parseERB(files: Map<string, string>, macros: Set<string>): Fn[];
export declare function parseThunk(lines: Slice[], from: number, until?: (l: string) => boolean): [Thunk, number];
