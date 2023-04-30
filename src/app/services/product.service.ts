import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from '../common/product';
import { ProductCategory } from '../common/product-category';
import { SuperCategory } from '../common/super-category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  categoryNumber: Subject<number> = new BehaviorSubject<number>(0);
  pageNumber: Subject<number> = new BehaviorSubject<number>(0);
  isSuperCategory: Subject<boolean> = new BehaviorSubject<boolean>(false);

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

  getProductImageUrlList(productId: number): Observable<string[]> {

    const searchUrl = this.baseUrl + 'products/' + productId + '/images';

    return this.httpClient.get<ImageGetResponse>(searchUrl).pipe(
      map(response => response._embedded.images.map(image => image.url))
    );
  }

  getProductListPaginate(thePage: number, thePageSize: number, theCategoryId: number, isSuperCategory: boolean = false): Observable<ProductGetResponse> {

    //need to build URL based on category id,page and size
    let searchURL = `${this.baseUrl}products/search/findByCategoryId?id=${theCategoryId}&page=${thePage}&size=${thePageSize}`;

    if (isSuperCategory) searchURL = `${this.baseUrl}products/search/findByCategorySuperCategoryId?id=${theCategoryId}&page=${thePage}&size=${thePageSize}`;

    return this.httpClient.get<ProductGetResponse>(searchURL);
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

  searchProductsPaginate(thePage: number, thePageSize: number, theKeyword: string): Observable<ProductGetResponse>{
    //need to build URL based on keyword, page and size
    const searchURL = `${this.baseUrl}products/search/findByNameContaining?name=${theKeyword}&page=${thePage}&size=${thePageSize}`;

    return this.httpClient.get<ProductGetResponse>(searchURL);
  }



  updateCategoryNumber(categoryNumber: number) {
    this.categoryNumber.next(categoryNumber);
  }

  updatePageNumber(thePageNumber: number) {
    this.pageNumber.next(thePageNumber);
  }

  updateIsSuperCategory(isSuperCategory: boolean) {
    this.isSuperCategory.next(isSuperCategory);
  }

}


interface ProductGetResponse {
  _embedded: {
    products: Product[];
  }
  page: {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number
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

interface ImageGetResponse {
  _embedded: {
    images: [
      {
        url: string;
      }
    ]
  }
}
