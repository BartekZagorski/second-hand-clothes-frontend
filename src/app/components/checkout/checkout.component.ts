import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Place } from 'src/app/common/place';
import { Province } from 'src/app/common/province';
import { CartService } from 'src/app/services/cart.service';
import { SecondHandFormService } from 'src/app/services/second-hand-form.service';
import { SecondHandValidators } from 'src/app/validators/second-hand-validators';

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
              private secondHandFormService: SecondHandFormService,
              private cartService: CartService
    ) { }

  ngOnInit(): void {

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('',
                                  [Validators.required,
                                  Validators.minLength(2),
                                  SecondHandValidators.notOnlyWhiteSpace,
                                  SecondHandValidators.atLeastTwoLettersWithNoWhiteSpace]),
        lastName: new FormControl('',
                                  [Validators.required,
                                  Validators.minLength(2),
                                  SecondHandValidators.notOnlyWhiteSpace,
                                  SecondHandValidators.atLeastTwoLettersWithNoWhiteSpace]),
        email: new FormControl('',
                              [Validators.required,
                              Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])
      }),
      shippingAddress: this.formBuilder.group({
        street: new FormControl('',
                                    [Validators.required,
                                    Validators.minLength(2),
                                    SecondHandValidators.notOnlyWhiteSpace,
                                    SecondHandValidators.atLeastTwoLettersWithNoWhiteSpace]),
        city: new FormControl('', [Validators.required]),
        province: new FormControl('', [Validators.required]),
        zipCode: new FormControl('',
                                    [Validators.required,
                                    Validators.pattern('[0-9]{2}-[0-9]{3}')])
      }),
      billingAddress: this.formBuilder.group({
        street: new FormControl('',
                                    [Validators.required,
                                    Validators.minLength(2),
                                    SecondHandValidators.notOnlyWhiteSpace,
                                    SecondHandValidators.atLeastTwoLettersWithNoWhiteSpace]),
        city: new FormControl('', [Validators.required]),
        province: new FormControl('', [Validators.required]),
        zipCode: new FormControl('',
                                    [Validators.required,
                                    Validators.pattern('[0-9]{2}-[0-9]{3}')])
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

    //subscribe to the totals
    this.reviewCartDetails();
  }

    // customer group getters neccesary to validation
    get firstName() { return this.checkoutFormGroup.get('customer.firstName'); }
    get lastName() { return this.checkoutFormGroup.get('customer.lastName'); }
    get email() { return this.checkoutFormGroup.get('customer.email'); }

      // shipping address group getters neccesary to validation
    get shippingStreet() { return this.checkoutFormGroup.get('shippingAddress.street'); }
    get shippingCity() { return this.checkoutFormGroup.get('shippingAddress.city'); }
    get shippingProvince() { return this.checkoutFormGroup.get('shippingAddress.province'); }
    get shippingZipCode() { return this.checkoutFormGroup.get('shippingAddress.zipCode'); }

      // billing address group getters neccesary to validation
      get billingStreet() { return this.checkoutFormGroup.get('billingAddress.street'); }
      get billingCity() { return this.checkoutFormGroup.get('billingAddress.city'); }
      get billingProvince() { return this.checkoutFormGroup.get('billingAddress.province'); }
      get billingZipCode() { return this.checkoutFormGroup.get('billingAddress.zipCode'); }
  

  populateProvinces() {
    this.secondHandFormService.getProvinces().subscribe(
      data => {
        this.provinces = data;
      }
    )
  }

  getPlaces(formGroupName: string) {

    const formGroup = this.checkoutFormGroup.get(formGroupName);

    const provinceId = formGroup?.value.province.id;

    this.secondHandFormService.getPlaces(provinceId).subscribe(
      data => {
        if(formGroupName === "shippingAddress") {
          this.shippingPlaces = data;
          //select first item by default
          formGroup?.get('city')?.setValue(data[0]);
          this.handleAddressControls();
        } else {
          this.billingPlaces = data;
          //select first item by default
          formGroup?.get('city')?.setValue(data[0]);
        }
      }

    );

  }

  onSubmit() {
    console.log("Handling the form submition");

    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }

    console.log(this.checkoutFormGroup.get('customer')!.value);
  }

  copyShippingAddressToBillingAddress(event: any) {

    if (event.target.checked) {
      this.copyAddressControl();
    } else {
      this.billingPlaces = []; // fixing the bug with no copying states
      this.checkoutFormGroup.controls['billingAddress'].reset();
    }
  }

  uncheckTheCheckbox() {
    const checkbox = document.getElementById("copyAddressCheckbox") as HTMLInputElement | null;

    if (checkbox != null && checkbox.checked) {
      checkbox.checked = false;
    }
  }

  handleAddressControls() {
    if (this.isCopyingAddressCheckboxChecked()) {
      this.copyAddressControl();
    }
  }

  isCopyingAddressCheckboxChecked(): boolean {
    const checkbox = document.getElementById("copyAddressCheckbox") as HTMLInputElement | null;
    
    return checkbox != null ? checkbox?.checked : false;
  }

  copyAddressControl() {
    this.billingPlaces = this.shippingPlaces; // fixing the bug with no copying states
    this.checkoutFormGroup.controls['billingAddress'].setValue(this.checkoutFormGroup.controls['shippingAddress'].value);
  }

  reviewCartDetails() {

    //subscribe data to the total price
    this.cartService.totalPrice.subscribe(
      data => {
        this.totalPrice = data;
    });

    //subscribe data to the total quantity
    this.cartService.totalQuantity.subscribe(
      data => {
        this.totalQuantity = data;
    });

    //subscribe data to the shipping cost
    this.cartService.shippingCost.subscribe(
      data => {
        this.shippingCost = data;
    });

    //subscribe data to the total 
    this.cartService.totalPriceWithShipping.subscribe(
      data => {
        this.totalPriceWithShipping = data;
    });

  }

}
