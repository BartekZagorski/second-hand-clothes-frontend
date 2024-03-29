import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Place } from '../common/place';
import { Province } from '../common/province';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SecondHandFormService {

  private provincesUrl = environment.secondHandApiUrl + '/provinces';
  private placesUrl =  environment.secondHandApiUrl + '/places';

  constructor(private httpClient: HttpClient) { }

  getProvinces(): Observable<Province[]> {
    return this.httpClient.get<GetProvincesResponse>(this.provincesUrl).pipe(
      map(response => response._embedded.provinces)
    );
  }

  getPlaces(provinceId: number): Observable<Place[]> {
    const searchUrl = this.placesUrl + "/search/findByProvinceIdOrderByNameAsc?id=" + provinceId;

    return this.httpClient.get<GetPlacesResponse>(searchUrl).pipe(
      map(response => response._embedded.places)
    );
  }

  getPlacesByName(provinceId: number, name: string): Observable<Place[]> {
    const searchUrl = this.placesUrl + "/search/findByProvinceIdAndNameStartingWithOrderByNameAsc?id=" + provinceId + "&name=" + name;

    return this.httpClient.get<GetPlacesResponse>(searchUrl).pipe(
      map(response => response._embedded.places)
    );
  }

}

interface GetProvincesResponse {
  _embedded: {
    provinces: Province[];
  }
}

interface GetPlacesResponse {
  _embedded: {
    places: Place[];
  }
}
