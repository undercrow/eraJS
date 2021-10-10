import type Define from "./define";
import type Dim from "./dim";
import type LocalSize from "./localsize";
import type LocalSSize from "./localssize";
import type Method from "./method";
import type Order from "./order";
import type Single from "./single";

type Property =
	| Define
	| Dim
	| LocalSize
	| LocalSSize
	| Method
	| Order
	| Single;

export default Property;
