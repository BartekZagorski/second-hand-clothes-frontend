import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { CartItem } from '../common/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[] = [];

  totalPrice: Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);

  constructor() { }

  addToCart(cartItem: CartItem) {
    
    //   check if we already have given item in our cart
    let alreadyExistsInTheCart: boolean = false;
    let existingCartItem: CartItem = undefined!;

    if (this.cartItems.length > 0) {
        //   find the item in our cart based on the item id
        existingCartItem = this.cartItems.find(item => item.id === cartItem.id)!;
        
        //   check if we found it
        alreadyExistsInTheCart = (existingCartItem != undefined);
      }

      if (alreadyExistsInTheCart) {
        existingCartItem.quantity++;
      } else {
        this.cartItems.push(cartItem);
      }

      this.computeCartTotals();
  }


  computeCartTotals() {

    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;
    
    for (let item of this.cartItems) {
      totalPriceValue += item.quantity * item.unitPrice;
      totalQuantityValue += item.quantity;
    }

    //publishing events of getting new values, every subscriber will receive the new data
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    //log the cart data for debugging purposes

    this.logCartData(totalPriceValue, totalQuantityValue);
  }
  logCartData(totalPriceValue: number, totalQuantityValue: number) {
    console.log("Contents of the cart");
    for (let item of this.cartItems) {
      const subTotalPrice = item.quantity * item.unitPrice;

      console.log(`name = ${item.name},  quantity = ${item.quantity},  unit price = ${item.unitPrice},  subtotal price = ${subTotalPrice}`);


      console.log(`total price = ${totalPriceValue.toFixed(2)},  total quantity = ${totalQuantityValue}`);
    }
  }

  



}
