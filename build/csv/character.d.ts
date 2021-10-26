export declare type Template = {
    no: number;
    name: string;
    callname: string;
    nickname: string;
    mastername: string;
    base: Map<number, number>;
    maxBase: Map<number, number>;
    mark: Map<number, number>;
    exp: Map<number, number>;
    abl: Map<number, number>;
    talent: Map<number, number>;
    relation: Map<number, number>;
    cflag: Map<number, number>;
    equip: Map<number, number>;
    juel: Map<number, number>;
    cstr: Map<number, string>;
};
export default function parse(fileName: string, rows: string[][]): Template;
