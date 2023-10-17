import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from '../common/product';
import { ProductCategory } from '../common/product-category';
import { SuperCategory } from '../common/super-category';
import { ActivatedRoute } from '@angular/router';
import { ProductDTO } from '../common/product-dto';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  
  categoryNumber: Subject<number> = new BehaviorSubject<number>(0);
  pageNumber: Subject<number> = new BehaviorSubject<number>(0);
  pageSize: Subject<number> = new BehaviorSubject<number>(0);
  isSuperCategory: Subject<boolean> = new BehaviorSubject<boolean>(false);
  searchMode: Subject<boolean> = new BehaviorSubject<boolean>(false);
  searchKeyword: Subject<string> = new BehaviorSubject<string>("");
  
  private baseUrl = 'https://localhost:8443/api/';
  
  constructor(private httpClient: HttpClient) { 
    this.updatePageSize(3);
  }

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

      getProductCategoriesBySuperCategoryName(superCategoryName: string): Observable<ProductCategory[]> {
        const searchUrl = this.baseUrl + 'product-categories/search/findBySuperCategoryName?name=' + superCategoryName;

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

  pushProduct(product: ProductDTO, files: File[]): Observable<any> {
    const postUrl = this.baseUrl + "products";

    const formData = new FormData();

    const httpHeaders = new HttpHeaders();
    httpHeaders.append('Content-Type', 'multipart/form-data');

    for (var i = 0; i < files.length; i++) { 
      formData.append("images", files[i], files[i].name);
    }

    formData.append("product", new Blob([JSON.stringify(product)], {type: "application/json"}));


    return this.httpClient.post(postUrl, formData, {
      headers: httpHeaders,
      responseType: 'blob'
    });
  }

  deleteProduct(id: number): Observable<any> {
    const deleteUrl = this.baseUrl+"products?id="+id;

    return this.httpClient.delete(deleteUrl)
  }

  
  updateCategoryNumber(categoryNumber: number) {
    this.categoryNumber.next(categoryNumber);
  }
  
  updatePageNumber(thePageNumber: number) {
    this.pageNumber.next(thePageNumber);
  }
  
  updatePageSize(thePageSize: number) {
    this.pageSize.next(thePageSize);
  }

  updateIsSuperCategory(isSuperCategory: boolean) {
    this.isSuperCategory.next(isSuperCategory);
  }

  updateSearchMode(searchMode: boolean) {
    this.searchMode.next(searchMode);
  }

  updateSearchKeyword(searchKeyword: string) {
    this.searchKeyword.next(searchKeyword);
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

// interface ImageGetResponse {
//   _embedded: {
//     images: [
//       {
//         url: string;
//       }
//     ]
//   }
// }
