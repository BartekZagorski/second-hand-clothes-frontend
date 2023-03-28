import { Component, OnInit } from '@angular/core';
import { CartItem } from 'src/app/common/cart-item';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.css']
})
export class CartDetailsComponent implements OnInit {

cartItems: CartItem[] = [];
totalPrice: number = 0.00;
totalQuantity: number = 0;
shippingCost: number = 0.00;
totalPriceWithShipping: number = 0.00;

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.listCartDetails();
  }

  listCartDetails() {
    //get a handle to the cart items
    this.cartItems = this.cartService.cartItems;
 
    //subscribe data to the total price
     this.cartService.totalPrice.subscribe(
       data => {
         this.totalPrice = data;
     });
 
    //subscribe data to the total quantity
    this.cartService.totalQuantity.subscribe(
     data => {
       this.totalQuantity = data;
    });

    //subscribe data to the shipping cost
    this.cartService.shippingCost.subscribe(
      data => {
        this.shippingCost = data;
      }
    )

    //subscribe data to the total price with shipping
    this.cartService.totalPriceWithShipping.subscribe(
      data => {
        this.totalPriceWithShipping = data;
      }
    )
  }

  incrementQuantity(cartItem: CartItem) {
    this.cartService.addToCart(cartItem);
  }

  decrementQuantity(cartItem: CartItem) {
    this.cartService.decrementQuantity(cartItem);
  }

  removeItem(cartItem: CartItem) {
    this.cartService.remove(cartItem);
  }
}
