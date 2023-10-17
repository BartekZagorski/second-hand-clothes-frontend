import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Place } from '../common/place';
import { Province } from '../common/province';

@Injectable({
  providedIn: 'root'
})
export class SecondHandFormService {

  private provincesUrl = 'https://localhost:8443/api/provinces';
  private placesUrl = 'https://localhost:8443/api/places';

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
