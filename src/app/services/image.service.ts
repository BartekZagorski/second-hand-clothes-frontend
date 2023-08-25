import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Image } from '../common/image';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  private baseUrl = 'http://localhost:8080/api/';

  constructor(private httpClient: HttpClient) { }

  getProductImageUrlList(productId: number): Observable<Image[]> {
      
    const searchUrl = this.baseUrl + 'images?productId=' + productId;
    
    return this.httpClient.get<Image[]>(searchUrl);
    }

  
  pushFile(files: File[], productId: string): Observable<any> {
    const postUrl = this.baseUrl + "images";

    const formData = new FormData();

    const httpHeaders = new HttpHeaders();
    httpHeaders.append('Content-Type', 'multipart/form-data');

    for (var i = 0; i < files.length; i++) { 
      formData.append("images", files[i]);
    }

    formData.append("productId", productId);
    return this.httpClient.post(postUrl, formData, {
      headers: httpHeaders,
      responseType: 'text'
    });
  }

  removeImage(id: number) : Observable<any> {
    const deleteUrl = this.baseUrl+"images/"+id;

    return this.httpClient.delete(deleteUrl);
  }

}
