export default class Const {
    value;
    constructor(value) {
        this.value = value;
    }
    // eslint-disable-next-line @typescript-eslint/require-await
    async reduce(_vm) {
        return this.value;
    }
}
