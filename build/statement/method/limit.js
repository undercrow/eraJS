import * as assert from "../../assert";
export default function limit(vm, arg) {
    const value = arg[0].reduce(vm);
    assert.number(value, "1st argument of LIMIT must a be number");
    const min = arg[1].reduce(vm);
    assert.number(min, "2nd argument of LIMIT must a be number");
    const max = arg[2].reduce(vm);
    assert.number(max, "3rd argument of LIMIT must a be number");
    if (value < min) {
        return min;
    }
    else if (value > max) {
        return max;
    }
    else {
        return value;
    }
}
