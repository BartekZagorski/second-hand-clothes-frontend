import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Image } from '../common/image';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(private httpClient: HttpClient) { }

  getProductImageUrlList(productId: number): Observable<Image[]> {
      
    const searchUrl = environment.secondHandApiUrl + '/images?productId=' + productId;
    
    return this.httpClient.get<Image[]>(searchUrl);
    }

  
  pushFile(files: File[], productId: string): Observable<any> {
    const postUrl = environment.secondHandApiUrl + "/images";

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
    const deleteUrl = environment.secondHandApiUrl+"/images/"+id;

    return this.httpClient.delete(deleteUrl);
  }

}
