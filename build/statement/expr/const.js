export default class Const {
    value;
    constructor(value) {
        this.value = value;
    }
    reduce(_vm) {
        return this.value;
    }
}
