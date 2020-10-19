export type BaseNode<T extends string> = {
	type: T;
};
function base<T extends string>(type: T): BaseNode<T> {
	return {
		type,
	};
}

type Label = BaseNode<"label"> & {
	name: string;
};
export const label = (name: string): Label => ({
	...base("label"),
	name,
});

type Goto = BaseNode<"goto"> & {
	dest: string;
};
export const goto = (dest: string): Goto => ({
	...base("goto"),
	dest,
});

export type Node = Label | Goto;
