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
export declare type Data = {
    gamebase: {
        author?: string;
        info?: string;
        year?: string;
        title?: string;
        code?: number;
        version?: number;
    };
    character: Map<number, Template>;
    ability: Map<number, string>;
    exp: Map<number, string>;
    item: Map<number, {
        name: string;
        price: number;
    }>;
    talent: Map<number, string>;
    mark: Map<number, string>;
    palam: Map<number, string>;
    train: Map<number, string>;
    str: Map<number, string>;
    varSize: Map<string, number[]>;
};
export default function parseCSV(content: Map<string, string>): Data;
