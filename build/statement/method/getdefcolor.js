import * as color from "../../color";
export default function getDefColor(vm, _arg) {
    return color.toHex(vm.color.defaultFront);
}
