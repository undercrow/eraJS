import { Template } from "./data";
import Value from "./value";
import VM from "./vm";
export default class Character {
    values: Map<string, Value>;
    constructor(vm: VM, template: Template);
    private setInt0DValue;
    private setStr0DValue;
    private setInt1DValue;
    private setStr1DValue;
    getValue<T extends Value>(name: string): T;
}
