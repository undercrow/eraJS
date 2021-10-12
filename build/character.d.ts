import { Template } from "./data";
import { SimpleValue } from "./value";
import VM from "./vm";
export default class Character {
    values: Map<string, SimpleValue>;
    constructor(vm: VM, template: Template);
    getValue<T extends SimpleValue>(name: string): T;
}
