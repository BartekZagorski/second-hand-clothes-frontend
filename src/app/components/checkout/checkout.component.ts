import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Place } from 'src/app/common/place';
import { Province } from 'src/app/common/province';
import { SecondHandFormService } from 'src/app/services/second-hand-form.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup!: FormGroup;

  totalQuantity: number = 0;
  totalPrice: number = 0.00;
  shippingCost: number = 0.00;
  totalPriceWithShipping: number = 0.00;

  provinces: Province[] = [];
  shippingPlaces: Place[] = [];
  billingPlaces: Place[] = [];

  constructor(private formBuilder: FormBuilder,
              private secondHandFormService: SecondHandFormService
    ) { }

  ngOnInit(): void {

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: [''],
        lastName: [''],
        email: ['']
      }),
      shippingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        province: [''],
        zipCode: ['']
      }),
      billingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        province: [''],
        zipCode: ['']
      }),
      creditCard: this.formBuilder.group({
        cardType: [''],
        nameOnCard: [''],
        cardNumber: [''],
        securityCode: [''],
        expirationMonth: [''],
        expirationYear: ['']
      })
    })


    //populate provinces
    this.populateProvinces();
  }


  populateProvinces() {
    this.secondHandFormService.getProvinces().subscribe(
      data => {
        this.provinces = data;
      }
    )
  }

  onSubmit() {
    console.log("Handling the form submition");
    console.log(this.checkoutFormGroup.get('customer')!.value);
  }

  copyShippingAddressToBillingAddress(event: any) {

    if (event.target.checked) {
      this.checkoutFormGroup.controls['billingAddress'].setValue(this.checkoutFormGroup.controls['shippingAddress'].value);
      //this.billingAddressStates = this.shippingAddressStates; // fixing the bug with no copying states
    } else {
      this.checkoutFormGroup.controls['billingAddress'].reset();
      //this.billingAddressStates = []; // fixing the bug with no copying states
    }
  }

}
