import Slice from "../../slice";
import Statement from "../index";
export default class SaveGame extends Statement {
    constructor(raw: Slice);
    run(): ReturnType<Statement["run"]>;
}
