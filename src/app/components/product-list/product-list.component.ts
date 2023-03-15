import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  currentCategoryId: number = 4;
  currentSuperCategoryId: number = 1;
  searchMode: boolean = false;

  constructor(private productService: ProductService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
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
    const theKeyword: string = this.route.snapshot.paramMap.get('keyword')!; //exclaimation mark is necessary here

    this.productService.searchProducts(theKeyword).subscribe(
      data => {
        this.products = data;
      }
    );
  }

  handleListProducts() {

    //check if "superId" parameter is available
    const hasSuperCategoryId: boolean = this.route.snapshot.paramMap.has('superId');

    if(hasSuperCategoryId) {
      console.log('there was a click in super category');
      this.provideListProductsBySuperCategory();
    } else {
      this.provideListProductsByCategory();
    }


  }

  provideListProductsByCategory() {
    //check if "id" parameter is available
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if (hasCategoryId) {
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!; // ! is a non-null assertion operator that is needed here to compile that fragment of code
    } else {
      this.currentCategoryId = 4;
      this.router.navigateByUrl('/category/' + this.currentCategoryId);

    }
    
    this.productService.getProductList(this.currentCategoryId).subscribe(
      data => {
        this.products = data;
      }
    )
  }

  provideListProductsBySuperCategory() {
        console.log(this.route.snapshot.paramMap);

        //check if "id" parameter is available
        const hasSuperCategoryId: boolean = this.route.snapshot.paramMap.has('superId');

        if (hasSuperCategoryId) {
          this.currentSuperCategoryId = +this.route.snapshot.paramMap.get('superId')!; // ! is a non-null assertion operator that is needed here to compile that fragment of code
        } else {
          this.currentSuperCategoryId = 1;
          this.router.navigateByUrl('/super-category/' + this.currentSuperCategoryId);
    
        }
        
        this.productService.getProductList(this.currentSuperCategoryId, true).subscribe(
          data => {
            this.products = data;
          }
        )
  }
  

}
