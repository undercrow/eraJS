import * as color from "../../color";
export default function getDefBgColor(vm, _arg) {
    return color.toHex(vm.color.defaultBack);
}
