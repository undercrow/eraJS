export default class Statement {
    raw;
    constructor(raw) {
        this.raw = raw;
    }
    // eslint-disable-next-line @typescript-eslint/require-await
    async *run(_vm, _label) {
        return null;
    }
}
