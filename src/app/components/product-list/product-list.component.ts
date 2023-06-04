import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  currentCategoryId: number = 6;
  previousCategoryId: number = 6;
  searchMode: boolean = false;

  isSuperCategory: boolean = false;
  previousIsSuperCategory: boolean = false;
  redirectUrl: string = "/category/" + this.currentCategoryId;
  currentParameterName: string = "";

  //new properties for pagination
  PageSizes: number[] = [1, 2, 3, 5, 10];
  thePageNumber: number = 1;
  thePageSize: number = 3;
  theTotalElements: number = 0;

  previousKeyword: string = "";

  constructor(private productService: ProductService,
              private cartService: CartService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.updateCategoryData();
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }

  listProducts() {

    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if(this.searchMode) {
      this.handleSearchProducts();
    } else {
      this.handleListProducts();
    }

  }
  handleSearchProducts() {
    const theKeyword: string = this.route.snapshot.paramMap.get("keyword")!;

    //if we had different current keyword than previous we simply assign pageNumber to 1

    if (theKeyword != this.previousKeyword) {
      this.thePageNumber = 1;
    }

    this.previousKeyword = theKeyword;
    console.log(`Current keyword = ${theKeyword}, page number = ${this.thePageNumber}`);

    //now search for the products using keyword

    this.productService.searchProductsPaginate(this.thePageNumber-1, this.thePageSize, theKeyword).subscribe(
      this.processResult()
    );
  }

  handleListProducts() {

    //check if "superId" parameter is available
    const hasSuperCategoryId: boolean = this.route.snapshot.paramMap.has('superId');

    if (hasSuperCategoryId) {
      this.isSuperCategory = true;
      this.currentParameterName = "superId";
      this.currentCategoryId = +this.route.snapshot.paramMap.get(this.currentParameterName)!;
      this.redirectUrl = "/super-category/" + this.currentCategoryId;
    } else {
      const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');
      
      if (hasCategoryId) {
        this.isSuperCategory = false;
        this.currentParameterName = "id";
        this.currentCategoryId = +this.route.snapshot.paramMap.get(this.currentParameterName)!;
        this.redirectUrl = "/category/" + this.currentCategoryId;
      } else {
        this.currentParameterName = "";
      }
    }

    this.provideListProductsByCategory();

  }

   getProductList(categoryId: number = this.currentCategoryId, isSuperCategory: boolean = false) {
    this.productService.getProductListPaginate(this.thePageNumber - 1, this.thePageSize, categoryId, isSuperCategory).subscribe(
      this.processResult()
    );
  }

  provideListProductsByCategory() {

    const hasCategoryId: boolean = this.route.snapshot.paramMap.has(this.currentParameterName);
    console.log("the hasCategoryId = " + hasCategoryId);

    if (this.currentParameterName != "" ) {
      this.currentCategoryId = +this.route.snapshot.paramMap.get(this.currentParameterName)!; // ! is a non-null assertion operator that is needed here to compile that fragment of code
    } else {
      this.currentCategoryId = 1
      setTimeout(() => {
        this.router.navigateByUrl(this.redirectUrl, { replaceUrl: true });
      }, 500);
      
    }
    //
    //
    //  check if we have different category than previous one
    //  Note: Angular will reuse a component if it was displayed previously
    // 
    // 
    // if we have different category Id than previous then we simply declare theCurrentPage to 1
    if (this.previousCategoryId != this.currentCategoryId || this.previousIsSuperCategory != this.isSuperCategory) {
      this.thePageNumber = 1;
      this.previousCategoryId = this.currentCategoryId;
      this.previousIsSuperCategory = this.isSuperCategory;
    }
    
    this.getProductList(this.currentCategoryId, this.isSuperCategory);

  }

  updatePageSize(newPageSize: string) {
    this.productService.updatePageSize(+newPageSize);
    this.thePageNumber = 1;
    this.listProducts();
  }

  addToTheCart(product: Product) {
    console.log("Product name: " + product.name + ", product price: " + product.unitPrice);

    const cartItem = new CartItem(product);

    this.cartService.addToCart(cartItem);
  }

  private processResult () {
    return (data: any) => {
    this.products = data._embedded.products;
    this.thePageNumber = data.page.number + 1;
    this.thePageSize = data.page.size;
    this.theTotalElements = data.page.totalElements;
    };
  }



  passDataToDetailView() {
    this.productService.updateCategoryNumber(this.currentCategoryId);
    this.productService.updatePageNumber(this.thePageNumber);
    this.productService.updatePageSize(this.thePageSize);
    this.productService.updateIsSuperCategory(this.isSuperCategory);
    this.productService.updateSearchMode(this.searchMode);
  }

  updateCategoryData() {
    this.productService.categoryNumber.subscribe(
      data => {this.previousCategoryId = data;}
    );
    this.productService.pageNumber.subscribe(
      data => {this.thePageNumber = data;}
    );
    this.productService.pageSize.subscribe(
      data => {this.thePageSize = data;}
    );
    this.productService.isSuperCategory.subscribe(
      data => {
        this.isSuperCategory = data;
        this.previousIsSuperCategory = data;
      }
    );
    this.productService.searchMode.subscribe(
      data => {this.searchMode = data;}
    );
  }



}
