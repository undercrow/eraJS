import Statement from "../index";
export default class CbgRemoveBmap extends Statement {
    constructor(arg: string);
    run(): Generator<never, null, unknown>;
}
