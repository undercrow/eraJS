import type Config from "./config";
import VM from "./vm";
export { default as EraJSError } from "./error";
export declare function compile(files: Map<string, string>): VM;
export type { Config, VM };
