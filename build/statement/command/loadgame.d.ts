import Slice from "../../slice";
import Statement from "../index";
export default class LoadGame extends Statement {
    constructor(raw: Slice);
    run(): ReturnType<Statement["run"]>;
}
