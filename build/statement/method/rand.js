import * as assert from "../../assert";
export default function rand(vm, arg) {
    if (arg.length === 0) {
        assert.cond(false, "RAND should have at least 1 argument");
    }
    else if (arg.length === 1) {
        const max = arg[0].reduce(vm);
        assert.number(max, "1st argument of RAND should be an integer");
        return vm.random.next() % max;
    }
    else {
        const min = arg[0].reduce(vm);
        assert.number(min, "1st argument of RAND should be an integer");
        const max = arg[1].reduce(vm);
        assert.number(max, "2nd argument of RAND should be an integer");
        return (vm.random.next() % (max - min)) + min;
    }
}
