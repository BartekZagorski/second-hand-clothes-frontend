import { Component, OnInit } from '@angular/core';
import { OrderHistory } from 'src/app/common/order-history';
import { OrderHistoryService } from 'src/app/services/order-history.service';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit {

  orderHistoryList: OrderHistory[] = [];
  storage: Storage = sessionStorage;
  userEmail: string = "";

  constructor(private service: OrderHistoryService) { }

  ngOnInit(): void {
    this.userEmail = JSON.parse(this.storage.getItem("id_token_claims_obj")!).email;
    this.handleOrderHistory();
  }

  handleOrderHistory() {
    this.service.getOrderHistory(this.userEmail).subscribe(
      data => {
        this.orderHistoryList = data._embedded.orders;
      }
    )
  }

}
