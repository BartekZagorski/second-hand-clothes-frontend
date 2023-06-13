import { CartItem } from "./cart-item";

export class OrderItem {
    
    imageUrl: string;
    name: string;
    unitPrice: number;
    productId: string;

constructor(item: CartItem) {
    this.imageUrl = item.imageUrl;
    this.name = item.name;
    this.unitPrice = item.unitPrice;
    this.productId = item.id;
}
}
