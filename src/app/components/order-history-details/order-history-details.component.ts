import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderItem } from 'src/app/common/order-item';
import { OrderHistoryService } from 'src/app/services/order-history.service';

@Component({
  selector: 'app-order-history-details',
  templateUrl: './order-history-details.component.html',
  styleUrls: ['./order-history-details.component.css']
})
export class OrderHistoryDetailsComponent implements OnInit {

  orderItems: OrderItem[] = [];
  totalPrice: number = 0.00;
  totalQuantity: number = 0;

  constructor(private service: OrderHistoryService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(
      () => {
        this.listOrderItems();
      }
    )
  }

  listOrderItems() {
    const orderId: string = this.route.snapshot.paramMap.get("id")!;
    this.service.getOrderHistoryItems(orderId).subscribe(
      data => {
        this.orderItems = data.orderItems;
        this.totalPrice = data.totalPrice;
        this.totalQuantity = data.totalQuantity;
      }
    )
  }
}
