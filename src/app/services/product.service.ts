import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from '../common/product';
import { ProductCategory } from '../common/product-category';
import { SuperCategory } from '../common/super-category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {


  private baseUrl = 'http://localhost:8080/api/';

  constructor(private httpClient: HttpClient) { }

  getProduct(productId: number): Observable<Product> {
    const productUrl = this.baseUrl + 'products/' + productId;
    
    return this.httpClient.get<Product>(productUrl);
  }

  getProductList(categoryId: number, isSuperCategory: boolean = false): Observable<Product[]> {

  let searchUrl = this.baseUrl + 'products/search/findByCategoryId?id=' + categoryId;

  if (isSuperCategory) searchUrl = this.baseUrl + 'products/search/findByCategorySuperCategoryId?id=' + categoryId;

    return this.httpClient.get<ProductGetResponse>(searchUrl).pipe(
      map(response => response._embedded.products)
    );
  }
  getProductCategories(): Observable<ProductCategory[]> {
    const searchUrl = this.baseUrl + 'product-categories';

    return this.httpClient.get<ProductCategoryGetResponse>(searchUrl).pipe(
      map(response => response._embedded.productCategories)
    );
  }

  getSuperCategories(): Observable<SuperCategory[]> {
    const searchUrl = this.baseUrl + 'super-categories';

    return this.httpClient.get<SuperCategoryGetResponse>(searchUrl).pipe(
      map(response => response._embedded.superCategories)
    );
  }

  searchProducts(theKeyword: string): Observable<Product[]> {
    const searchUrl = this.baseUrl + 'products/search/findByNameContaining?name=' + theKeyword;

    return this.httpClient.get<ProductGetResponse>(searchUrl).pipe(
      map(response => response._embedded.products)
    );
  }
}


interface ProductGetResponse {
  _embedded: {
    products: Product[];
  }
}

interface ProductCategoryGetResponse {
  _embedded: {
    productCategories: ProductCategory[];
  }
}

interface SuperCategoryGetResponse {
  _embedded: {
    superCategories: SuperCategory[];
  }
}
