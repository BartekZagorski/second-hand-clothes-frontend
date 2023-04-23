import { CartItem } from "./cart-item";

export class OrderItem {
    
    imageUrl: string;
    unitPrice: number;
    productId: string;

constructor(item: CartItem) {
    this.imageUrl = item.imageUrl;
    this.unitPrice = item.unitPrice;
    this.productId = item.id;
}
}
