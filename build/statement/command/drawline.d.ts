import Statement from "../index";
export default class DrawLine extends Statement {
    constructor(arg: string);
    run(): Generator<{
        readonly type: "line";
    }, null, unknown>;
}
