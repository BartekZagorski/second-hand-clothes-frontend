import { Component, OnInit } from '@angular/core';
import { ProductCategory } from 'src/app/common/product-category';
import { SuperCategory } from 'src/app/common/super-category';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-category-menu',
  templateUrl: './product-category-menu.component.html',
  styleUrls: ['./product-category-menu.component.css']
})
export class ProductCategoryMenuComponent implements OnInit {

  productCategories: ProductCategory[] = [];
  superCategories: SuperCategory[] = [];

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.listSuperCategories();
    this.listProductCategories();
  }

  listSuperCategories() {
    this.productService.getSuperCategories().subscribe(
      data => {
        this.superCategories = data;
      }
    );
  }

  listProductCategories() {
    this.productService.getProductCategories().subscribe(
      data => {
        console.log('Product categories:' + JSON.stringify(data));
        this.productCategories = data;
      }
    );
  }

}
