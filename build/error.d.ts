import Slice from "./slice";
export default class EraJSError extends Error {
    line: Slice;
    trace: string[];
    constructor(message: string, line: Slice, trace: string[]);
}
export declare function parser(message: string): Error;
export declare function notFound(type: string, name: string): Error;
export declare function invalidIndex(type: string, name: string, index: number[]): Error;
export declare function notImpl(target: string): Error;
export declare function internal(message: string): Error;
