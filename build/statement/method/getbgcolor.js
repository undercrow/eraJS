import * as color from "../../color";
export default function getBgColor(vm, _arg) {
    return color.toHex(vm.color.back);
}
