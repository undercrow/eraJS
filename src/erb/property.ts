import P from "parsimmon";

import type Property from "../property";
import Dim from "../property/dim";
import DimDynamic from "../property/dim-dynamic";
import DimRef from "../property/dim-ref";
import LocalSize from "../property/localsize";
import LocalSSize from "../property/localssize";
import Method from "../property/method";
import Order from "../property/order";
import * as U from "./util";

const parser = P.string("#").then(U.Identifier).chain<Property>((property) => {
	switch (property.toUpperCase()) {
		case "PRI": return U.arg0R0().map(() => new Order("PRI"));
		case "LATER": return U.arg0R0().map(() => new Order("LATER"));
		case "DIM": {
			const dimArgument = P.seq(
				U.sepBy1(",", U.Identifier, U.Int),
				P.alt(
					P.string("=").trim(U.WS0).then(U.sepBy0(",", U.Int)),
					P.succeed(undefined),
				),
			);
			return P.alt<Property>(
				U.WS1.then(P.regex(/DYNAMIC/i).skip(U.WS1).then(dimArgument).map(
					([[name, ...size], value]) => new DimDynamic(name, "number", size, value),
				)),
				U.WS1.then(P.regex(/REF/i).skip(U.WS1).then(dimArgument).map(
					([[name]]) => new DimRef(name),
				)),
				U.WS1.then(dimArgument).map(
					([[name, ...size], value]) => new Dim(name, "number", size, value),
				),
			);
		}
		case "DIMS": {
			const dimArgument = P.seq(
				U.sepBy1(",", U.Identifier, U.Int),
				P.alt(
					P.string("=").trim(U.WS0).then(U.sepBy0(",", U.Str)),
					P.succeed(undefined),
				),
			);
			return P.alt<Property>(
				U.WS1.then(P.regex(/DYNAMIC/i).skip(U.WS1).then(dimArgument).map(
					([[name, ...size], value]) => new DimDynamic(name, "string", size, value),
				)),
				U.WS1.then(P.regex(/REF/i).skip(U.WS1).then(dimArgument).map(
					([[name]]) => new DimRef(name),
				)),
				U.WS1.then(dimArgument).map(
					([[name, ...size], value]) => new Dim(name, "string", size, value),
				),
			);
		}
		case "FUNCTION": return U.arg0R0().map(() => new Method());
		case "FUNCTIONS": return U.arg0R0().map(() => new Method());
		case "LOCALSIZE": return U.arg1R1(U.UInt).map((size) => new LocalSize(size));
		case "LOCALSSIZE": return U.arg1R1(U.UInt).map((size) => new LocalSSize(size));
		default: return P.fail(`${property} is not a valid property`);
	}
});

export default parser;
