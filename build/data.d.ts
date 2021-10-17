export declare type Template = {
    id: number;
    name: string;
    callname: string;
    nickname: string;
    mastername: string;
    talent: Map<number, number>;
    maxBase: Map<number, number>;
    base: Map<number, number>;
    abilities: Map<number, number>;
    exp: Map<number, number>;
    flags: Map<number, number>;
    cstr: Map<number, string>;
    mark: Map<number, number>;
    juel: Map<number, number>;
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
