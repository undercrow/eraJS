import * as color from "../../color";
export default function getColor(vm, _arg) {
    return color.toHex(vm.color.front);
}
