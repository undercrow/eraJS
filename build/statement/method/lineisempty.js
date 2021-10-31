export default function lineIsEmpty(vm, _arg) {
    return vm.printer.chunks.length === 0 ? 1 : 0;
}
