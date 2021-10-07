import { assertNumber, assertString } from "../assert";
import Value from "../value";
import Int1DValue from "../value/int-1d";
import Str1DValue from "../value/str-1d";
export default class Dim {
    name;
    type;
    size;
    value;
    constructor(name, type, size, value) {
        this.name = name;
        this.type = type;
        this.size = size;
        this.value = value;
    }
    apply(vm, variableMap) {
        if (this.value != null && this.value.length === 0 && this.type === "number") {
            const value = this.value[0].reduce(vm);
            assertNumber(value, "Default value for #DIM must be a number");
            variableMap.set(this.name, Value.Int0D(vm.code.data, this.name).reset(value));
        }
        else if (this.value != null && this.value.length === 0 && this.type === "string") {
            const value = this.value[0].reduce(vm);
            assertString(value, "Default value for #DIMS must be a string");
            variableMap.set(this.name, Value.Str0D(vm.code.data, this.name).reset(value));
        }
        else if (this.value != null && this.value.length === 1 && this.type === "number") {
            const value = this.value.map((v) => v.reduce(vm));
            value.forEach((v) => assertNumber(v, "Default value for #DIM must be a number"));
            variableMap.set(this.name, Value.Int1D(vm.code.data, this.name, value.length).reset(value));
        }
        else if (this.value != null && this.value.length === 1 && this.type === "string") {
            const value = this.value.map((v) => v.reduce(vm));
            value.forEach((v) => assertString(v, "Default value for #DIMS must be a string"));
            variableMap.set(this.name, Value.Str1D(vm.code.data, this.name, value.length).reset(value));
        }
        else if (this.size.length === 0 && this.type === "number") {
            variableMap.set(this.name, Value.Int0D(vm.code.data, this.name));
        }
        else if (this.size.length === 0 && this.type === "string") {
            variableMap.set(this.name, Value.Str0D(vm.code.data, this.name));
        }
        else if (this.size.length === 1 && this.type === "number") {
            const size = this.size[0].reduce(vm);
            assertNumber(size, "Size of an array must be an integer");
            variableMap.set(this.name, new Int1DValue(this.name, size));
        }
        else if (this.size.length === 1 && this.type === "string") {
            const size = this.size[0].reduce(vm);
            assertNumber(size, "Size of an array must be an integer");
            variableMap.set(this.name, new Str1DValue(this.name, size));
        }
    }
}
