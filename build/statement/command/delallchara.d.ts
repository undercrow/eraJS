import Statement from "../index";
export default class DelAllChara extends Statement {
    constructor(arg: string);
    run(): Generator<never, null, unknown>;
}
