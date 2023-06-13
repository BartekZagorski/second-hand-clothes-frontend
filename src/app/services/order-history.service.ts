import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderHistory } from '../common/order-history';
import { OrderItem } from '../common/order-item';

@Injectable({
  providedIn: 'root'
})
export class OrderHistoryService {

  private orderUrl = "http://localhost:8080/api/orders";

  constructor(private httpClient: HttpClient) { 
    
  }

  getOrderHistory(theEmail: string): Observable<GetResponseOrderHistory> {

    const orderHistoryUrl = this.orderUrl + "/search/findByCustomerEmail?email=" + theEmail;

    console.log(orderHistoryUrl);

    return this.httpClient.get<GetResponseOrderHistory>(orderHistoryUrl);
  }

  getOrderHistoryItems(id: string): Observable<GetResponseOrderHistoryItems> {
    return this.httpClient.get<GetResponseOrderHistoryItems>(this.orderUrl + "/" + id);
  }
}

interface GetResponseOrderHistory {
  _embedded: {
    orders: OrderHistory[];
  }
  page: {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number
    }
}

interface GetResponseOrderHistoryItems {
  orderItems: OrderItem[];
  orderTrackingNumber: string;
  totalPrice: number;
  totalQuantity: number;
}
