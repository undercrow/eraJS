import Statement from "../index";
export default class LoadGame extends Statement {
    constructor(arg: string);
    run(): Generator<{
        readonly type: "loadgame";
    }, null, unknown>;
}
