import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from '../common/product';
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {


  private baseUrl = 'http://localhost:8080/api/';

  constructor(private httpClient: HttpClient) { }

  getProductList(categoryId: number): Observable<Product[]> {

  const searchUrl = this.baseUrl + 'products/search/findByCategoryId?id=' + categoryId;

    return this.httpClient.get<ProductGetResponse>(searchUrl).pipe(
      map(response => response._embedded.products)
    )
  }
  getProductCategories(): Observable<ProductCategory[]> {
    const searchUrl = this.baseUrl + 'product-categories';

    return this.httpClient.get<ProductCategoryGetResponse>(searchUrl).pipe(
      map(response => response._embedded.productCategories)
    )
  }

  searchProducts(theKeyword: string): Observable<Product[]> {
    const searchUrl = this.baseUrl + 'products/search/findByNameContaining?name=' + theKeyword;

    return this.httpClient.get<ProductGetResponse>(searchUrl).pipe(
      map(response => response._embedded.products)
    )
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
