import Slice from "./slice";
export declare enum ErrorType {
    Parser = 0,
    NotFound = 1,
    InvalidIndex = 2,
    NotImpl = 3,
    Internal = 4
}
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
