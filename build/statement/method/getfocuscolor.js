import * as color from "../../color";
export default function getFocusColor(vm, _arg) {
    return color.toHex(vm.color.focus);
}
