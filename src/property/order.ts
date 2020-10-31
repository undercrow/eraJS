export default class Order {
	public order: "PRI" | "LATER";

	public constructor(order: Order["order"]) {
		this.order = order;
	}
}
