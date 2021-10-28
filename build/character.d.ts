import { Template } from "./csv/character";
import Value from "./value";
import VM from "./vm";
export default class Character {
    values: Map<string, Value<any>>;
    constructor(vm: VM, template: Template);
    getValue<T extends Value<any>>(name: string): T;
}
