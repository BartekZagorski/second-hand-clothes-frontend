import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Order } from '../common/order';

@Injectable({
  providedIn: 'root'
})
export class OrderHistoryService {

  private orderUrl = "http://localhost:8080/api/orders";

  constructor(private httpClient: HttpClient) { 
    
  }

  getOrderHistory(theEmail: string): Observable<GetResponseOrderHistory> {

    const orderHistoryUrl = this.orderUrl + "/search/findByCustomerEmail?email=" + theEmail;

    return this.httpClient.get<GetResponseOrderHistory>(orderHistoryUrl);
  }
}

interface GetResponseOrderHistory {
  _embedded: {
    orders: Order[];
  }
  page: {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number
    }
}
