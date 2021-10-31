import VM from "./vm";
export { default as Config } from "./config";
export { default as EraJSError } from "./error";
export { ButtonChunk, Chunk, ClearOutput, ContentOutput, InputOutput, LineOutput, Output, StringChunk, TInputOutput, WaitOutput, } from "./statement";
export type { VM };
export declare function compile(files: Map<string, string>): VM;
