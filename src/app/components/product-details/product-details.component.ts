import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {

  public product!: Product;
  public images: string[] = [];

  constructor(private productService: ProductService,
              private cartService: CartService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.handleProductDetails();
    })
  }
  
  handleProductDetails() {
    const currentId = +this.route.snapshot.paramMap.get("id")!;

    this.productService.getProduct(currentId).subscribe(
      data => {
        this.product = data;
      }
    )
    this.productService.getProductImageUrlList(currentId).subscribe(
      data => {
        this.images = data;
      }
    )
    
  }

  addToTheCart() {
    const theCartItem = new CartItem(this.product);

    this.cartService.addToCart(theCartItem);
  }

}
