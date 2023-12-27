import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderHistory } from '../common/order-history';
import { OrderItem } from '../common/order-item';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderHistoryService {

  private ordersUrl = environment.secondHandApiUrl + "/orders";

  constructor(private httpClient: HttpClient) { 
    
  }

  getOrderHistory(theEmail: string): Observable<GetResponseOrderHistory> {

    const orderHistoryUrl = this.ordersUrl + "/search/findByCustomerEmailOrderByDateCreatedDesc?email=" + theEmail;

    console.log(orderHistoryUrl);

    return this.httpClient.get<GetResponseOrderHistory>(orderHistoryUrl);
  }

  getOrderHistoryItems(email: string, id: string): Observable<GetResponseOrderHistoryItems> {

    const particularOrderUrl = this.ordersUrl + "/search/findByCustomerEmailAndId?email=" + email + "&id=" + id;

    return this.httpClient.get<GetResponseOrderHistoryItems>(particularOrderUrl);
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
  _embedded: {
    orders: [
      {
        orderItems: OrderItem[];
        orderTrackingNumber: string;
        totalPrice: number;
        totalQuantity: number;
        shippingCost: number;
      }
    ]
  }
}
