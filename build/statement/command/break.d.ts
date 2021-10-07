import Statement from "../index";
export default class Break extends Statement {
    constructor(arg: string);
    run(): Generator<never, {
        readonly type: "break";
    }, unknown>;
}
