import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbCarousel } from '@ng-bootstrap/ng-bootstrap';
import { OAuthService } from 'angular-oauth2-oidc';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { ImageService } from 'src/app/services/image.service';
import { ProductService } from 'src/app/services/product.service';
import { UploadFileComponent } from '../upload-file/upload-file.component';
import { Image } from 'src/app/common/image';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {

  public product?: Product;
  public images: Image[] = [];

  categoryNumber: number = 3;
  pageNumber: number = 1;
  pageSize: number = 3;
  isSuperCategory: boolean = false;
  searchMode: boolean = false;
  searchKeyword: string = '';

  
  roles: string[] = [];

  @ViewChild(UploadFileComponent, {static : true}) uploadFileComponent!:UploadFileComponent;

  constructor(private productService: ProductService,
              private cartService: CartService,
              private imageService: ImageService,
              private router: Router,
              private route: ActivatedRoute,
              private oauthService: OAuthService) { }

  ngOnInit(): void {
    this.updateProductDetails();
    console.log("This is the category number: " + this.categoryNumber);
    this.route.paramMap.subscribe(() => {
      this.handleProductDetails();
    })
    if(this.oauthService.hasValidAccessToken()) {
      this. roles = this.oauthService.getIdentityClaims()['realm_access']['roles'];
    }
  }
  
  handleProductDetails() {
    const currentId = +this.route.snapshot.paramMap.get("id")!;
    this.productService.getProduct(currentId).subscribe(
      data => {
        this.product = data;
      }
    )
    this.imageService.getProductImageUrlList(currentId).subscribe(
      data => {
        this.images = data;
        console.log(this.images);
      }
    )
  }

  addToTheCart() {
  const theCartItem = new CartItem(this.product!);

    this.cartService.addToCart(theCartItem);
  }

  updateProductDetails() {
    this.productService.categoryNumber.subscribe(
      data => {data!=0?this.categoryNumber = data:null;}
    );
    this.productService.pageNumber.subscribe(
      data => {this.pageNumber = data;}
    );
    this.productService.pageSize.subscribe(
      data => {this.pageSize= data;}
    );
    this.productService.isSuperCategory.subscribe(
      data => {this.isSuperCategory = data;}
    );
    this.productService.searchMode.subscribe(
      data => {this.searchMode = data;}
    );
    this.productService.searchKeyword.subscribe(
      data => {this.searchKeyword = data;}
    );
  }

  getBacktoTheProductList() {
    if (this.searchMode) {
      this.router.navigateByUrl(`/search/${this.searchKeyword}`);
    } else {
      const redirectUrl = this.isSuperCategory ? "/super-category/" : "/category/";
      this.router.navigateByUrl(redirectUrl + this.categoryNumber);
    }
  }


  editImages() {
    const productId = this.route.snapshot.paramMap.get("id");

    this.router.navigateByUrl(`/products/${productId}/images`);
  }

  uploadFile() {
    this.uploadFileComponent.uploadFile();
  }

}
