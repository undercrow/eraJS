import type Config from "./config";
import VM from "./vm";
export declare function compile(erh: string[], erb: string[], csv: Map<string, string>): VM;
export type { Config, VM };
