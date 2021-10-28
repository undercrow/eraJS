import Slice from "../slice";
export declare function normalize(raw: string): string;
export declare function toLines(raw: string): Slice[];
export declare function preprocess(lines: Slice[], macros: Set<string>): Slice[];
