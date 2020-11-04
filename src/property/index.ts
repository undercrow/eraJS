import type Dim from "./dim";
import type DimDynamic from "./dim-dynamic";
import type LocalSize from "./localsize";
import type LocalSSize from "./localssize";
import type Method from "./method";
import type Order from "./order";

type Property =
	| Dim
	| DimDynamic
	| LocalSize
	| LocalSSize
	| Method
	| Order;

export default Property;
