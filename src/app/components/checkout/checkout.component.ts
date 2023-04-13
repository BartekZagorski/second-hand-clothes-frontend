import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Place } from 'src/app/common/place';
import { Province } from 'src/app/common/province';
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
              private secondHandFormService: SecondHandFormService
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

    // customer group getters neccesary to validation
    get firstName() { return this.checkoutFormGroup.get('customer.firstName'); }
    get lastName() { return this.checkoutFormGroup.get('customer.lastName'); }
    get email() { return this.checkoutFormGroup.get('customer.email'); }

      // shipping address group getters neccesary to validation
    get shippingCountry() { return this.checkoutFormGroup.get('shippingAddress.country'); }
    get shippingStreet() { return this.checkoutFormGroup.get('shippingAddress.street'); }
    get shippingCity() { return this.checkoutFormGroup.get('shippingAddress.city'); }
    get shippingState() { return this.checkoutFormGroup.get('shippingAddress.state'); }
    get shippingZipCode() { return this.checkoutFormGroup.get('shippingAddress.zipCode'); }

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

}
