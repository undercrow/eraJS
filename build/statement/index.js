export default class Statement {
    raw;
    constructor(raw) {
        this.raw = raw;
    }
    *run(_vm, _label) {
        return null;
    }
}
