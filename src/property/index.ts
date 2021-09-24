import type Define from "./define";
import type Dim from "./dim";
import type DimDynamic from "./dim-dynamic";
import type DimRef from "./dim-ref";
import type LocalSize from "./localsize";
import type LocalSSize from "./localssize";
import type Method from "./method";
import type Order from "./order";

type Property =
	| Define
	| Dim
	| DimDynamic
	| DimRef
	| LocalSize
	| LocalSSize
	| Method
	| Order;

export default Property;
