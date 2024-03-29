import type {Leaf} from "../../value";
import type VM from "../../vm";

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export default interface Expr {
	reduce: (vm: VM) => Promise<Leaf>;
}
