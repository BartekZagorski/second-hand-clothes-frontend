import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from '../common/product';
import { ProductCategory } from '../common/product-category';
import { SuperCategory } from '../common/super-category';
import { ActivatedRoute } from '@angular/router';
import { ProductDTO } from '../common/product-dto';
import { environment } from 'src/environments/environment';

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
  
  constructor(private httpClient: HttpClient) { 
    this.updatePageSize(3);
  }

  getProduct(productId: number): Observable<Product> {
    const productUrl = environment.secondHandApiUrl + '/products/' + productId;
    
    return this.httpClient.get<Product>(productUrl);
  }

  getProductList(categoryId: number, isSuperCategory: boolean = false): Observable<Product[]> {

    let searchUrl = environment.secondHandApiUrl + '/products/search/findByCategoryId?id=' + categoryId;
    
    if (isSuperCategory) searchUrl = environment.secondHandApiUrl + '/products/search/findByCategorySuperCategoryId?id=' + categoryId;
    
    return this.httpClient.get<ProductGetResponse>(searchUrl).pipe(
      map(response => response._embedded.products)
      );
    }
      
      getProductListPaginate(thePage: number, thePageSize: number, theCategoryId: number, isSuperCategory: boolean = false): Observable<ProductGetResponse> {
        
        //need to build URL based on category id,page and size
        let searchURL = `${environment.secondHandApiUrl}/products/search/findByCategoryId?id=${theCategoryId}&page=${thePage}&size=${thePageSize}`;
        
        if (isSuperCategory) searchURL = `${environment.secondHandApiUrl}/products/search/findByCategorySuperCategoryId?id=${theCategoryId}&page=${thePage}&size=${thePageSize}`;
        
        return this.httpClient.get<ProductGetResponse>(searchURL);
      }
      
      getProductCategories(): Observable<ProductCategory[]> {
        const searchUrl = environment.secondHandApiUrl + '/product-categories';
        
        return this.httpClient.get<ProductCategoryGetResponse>(searchUrl).pipe(
          map(response => response._embedded.productCategories)
          );
        }

      getProductCategoriesBySuperCategoryName(superCategoryName: string): Observable<ProductCategory[]> {
        const searchUrl = environment.secondHandApiUrl + '/product-categories/search/findBySuperCategoryName?name=' + superCategoryName;

        return this.httpClient.get<ProductCategoryGetResponse>(searchUrl).pipe(
          map(response => response._embedded.productCategories)
          );
      }
        
      getSuperCategories(): Observable<SuperCategory[]> {
        const searchUrl = environment.secondHandApiUrl + '/super-categories';

        return this.httpClient.get<SuperCategoryGetResponse>(searchUrl).pipe(
          map(response => response._embedded.superCategories)
        );
      }

  searchProducts(theKeyword: string): Observable<Product[]> {
    const searchUrl = environment.secondHandApiUrl + '/products/search/findByNameContaining?name=' + theKeyword;

    return this.httpClient.get<ProductGetResponse>(searchUrl).pipe(
      map(response => response._embedded.products)
      );
    }
    
    searchProductsPaginate(thePage: number, thePageSize: number, theKeyword: string): Observable<ProductGetResponse>{
      //need to build URL based on keyword, page and size
      const searchURL = `${environment.secondHandApiUrl}/products/search/findByNameContaining?name=${theKeyword}&page=${thePage}&size=${thePageSize}`;

    return this.httpClient.get<ProductGetResponse>(searchURL);
  }

  pushProduct(product: ProductDTO, files: File[]): Observable<any> {
    const postUrl = environment.secondHandApiUrl + "/products";

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
    const deleteUrl = environment.secondHandApiUrl+"/products?id="+id;

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
