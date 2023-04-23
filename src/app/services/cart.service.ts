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
  shippingCost: Subject<number> = new BehaviorSubject<number>(0);
  totalPriceWithShipping: Subject<number> = new BehaviorSubject<number>(0);

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
        alert("Ten produkt już znajduje się w Twoim koszyku.");
      } else {
        this.cartItems.push(cartItem);
        alert("Dodano produkt do koszyka.");
      }

      this.computeCartTotals();
  }


  computeCartTotals() {

    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;
    let shippingCost: number = 0;
    let totalPriceWithShipping: number = 0;
    
    for (let item of this.cartItems) {
      totalPriceValue += item.unitPrice;
      totalQuantityValue++;
    }

    totalPriceValue < 100 ? shippingCost = 10.00 : shippingCost = 0.00;
    totalPriceWithShipping = totalPriceValue + shippingCost;

    //publishing events of getting new values, every subscriber will receive the new data
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);
    this.shippingCost.next(shippingCost);
    this.totalPriceWithShipping.next(totalPriceWithShipping);

    //log the cart data for debugging purposes

    this.logCartData(totalPriceValue, totalQuantityValue);
  }

  logCartData(totalPriceValue: number, totalQuantityValue: number) {
    console.log("Contents of the cart");
    for (let item of this.cartItems) {
      console.log(`name = ${item.name},  unit price = ${item.unitPrice}`);


      console.log(`total price = ${totalPriceValue.toFixed(2)},  total quantity = ${totalQuantityValue}`);
    }
  }
  
  remove(cartItem: CartItem) {
    //find index of cartItem in the cartItems array
    const itemIndex = this.cartItems.findIndex(tempCartItem => tempCartItem.id === cartItem.id);

    //if found just remove it from cartItems array
    if (itemIndex > -1) {
      this.cartItems.splice(itemIndex, 1);

      this.computeCartTotals();
    }
  }


}
