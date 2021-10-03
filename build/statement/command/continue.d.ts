import Statement from "../index";
export default class Continue extends Statement {
    constructor(arg: string);
    run(): Generator<never, {
        readonly type: "continue";
    }, unknown>;
}
