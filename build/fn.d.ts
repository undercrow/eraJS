import type Property from "./property";
import type { EraGenerator } from "./statement";
import Variable from "./statement/expr/variable";
import Thunk from "./thunk";
import type VM from "./vm";
export default class Fn {
    static START_OF_FN: string;
    name: string;
    arg: Array<[Variable, Variable | string | number | null]>;
    property: Property[];
    thunk: Thunk;
    constructor(name: string, arg: Fn["arg"], property: Property[], thunk: Thunk);
    isFirst(): boolean;
    isLast(): boolean;
    run(vm: VM, arg: Array<string | number | undefined>): EraGenerator;
}
