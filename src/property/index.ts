import type Dim from "./dim";
import type DimS from "./dims";
import type LocalSize from "./localsize";
import type LocalSSize from "./localssize";
import type Order from "./order";

type Property =
	| Dim
	| DimS
	| LocalSize
	| LocalSSize
	| Order;

export default Property;
