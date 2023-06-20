import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderItem } from 'src/app/common/order-item';
import { OrderHistoryService } from 'src/app/services/order-history.service';

@Component({
  selector: 'app-order-history-details',
  templateUrl: './order-history-details.component.html',
  styleUrls: ['./order-history-details.component.css']
})
export class OrderHistoryDetailsComponent implements OnInit {

  orderItems: OrderItem[] = [];
  orderTrackingNumber: string = "";
  totalPrice: number = 0.00;
  totalQuantity: number = 0;
  shippingCost: number = 0.00;

  constructor(private service: OrderHistoryService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(
      () => {
        this.listOrderItems();
      }
    )
  }

  listOrderItems() {
    const orderEmail: string = this.route.snapshot.paramMap.get("email")!;
    const orderId: string = this.route.snapshot.paramMap.get("id")!;
    this.service.getOrderHistoryItems(orderEmail, orderId).subscribe(
      data => {
        if (data._embedded.orders[0] == null) {
          this.router.navigateByUrl("/order-history");
        } else {
          this.orderItems = data._embedded.orders[0].orderItems;
          this.orderTrackingNumber = data._embedded.orders[0].orderTrackingNumber;
          this.totalPrice = data._embedded.orders[0].totalPrice;
          this.totalQuantity = data._embedded.orders[0].totalQuantity;
          data._embedded.orders[0].shippingCost != null ? this.shippingCost = data._embedded.orders[0].shippingCost : this.shippingCost = 0.00;
        }
      }
    )
  }
}
