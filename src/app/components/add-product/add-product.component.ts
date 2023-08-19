import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { Observable, OperatorFunction, Subject, debounceTime, distinctUntilChanged, filter, map, merge, switchMap } from 'rxjs';
import { ProductDTO } from 'src/app/common/product-dto';
import { ProductService } from 'src/app/services/product.service';
import { SecondHandValidators } from 'src/app/validators/second-hand-validators';
import { UploadFileComponent } from '../upload-file/upload-file.component';
import { ImageService } from 'src/app/services/image.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {

  superCategories: string[] = [];
  productCategories: string[] = [];

  

  addProductGroup!: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private productService: ProductService,
              private imageService: ImageService) { }

  ngOnInit(): void {

    this.getSuperCategories();

    this.addProductGroup = this.formBuilder.group({
      name: new FormControl("",
                            [Validators.required,
                              Validators.minLength(2),
                              SecondHandValidators.notOnlyWhiteSpace,
                              SecondHandValidators.atLeastTwoLettersWithNoWhiteSpace]),
      superCategory: new FormControl("", Validators.required),
      category: new FormControl("", Validators.required),
      price: new FormControl('', Validators.required),
      description: new FormControl("",
                                    [Validators.required,
                                    Validators.minLength(2),
                                    SecondHandValidators.notOnlyWhiteSpace,
                                    SecondHandValidators.atLeastSomeLettersWithNoWhiteSpace(20)]),
      images: new FormControl(null, Validators.required)
    });
  }

  get name() {return this.addProductGroup.get("name");}
  get superCategory() {return this.addProductGroup.get("superCategory");}
  get category() {return this.addProductGroup.get("category");}
  get price() {return this.addProductGroup.get("price");}
  get description() {return this.addProductGroup.get("description");}
  get images() {return this.addProductGroup.get("images");}

  onSubmit() {
    if (this.addProductGroup.invalid) {
      this.addProductGroup.markAllAsTouched();
      return;
    }

    const product: ProductDTO = new ProductDTO();

    product.name = this.addProductGroup.controls['name'].value;
    product.category = this.addProductGroup.controls['category'].value;
    product.description = this.addProductGroup.controls['description'].value;
    product.unitPrice = this.addProductGroup.controls['price'].value;
    const files = this.addProductGroup.controls['images'].value;
    product.imageUrl = "assets/" + files[0].name;

    console.log(product);

    this.productService.pushProduct(product).subscribe({
      next: response => {
        alert("Dodano produkt");
        this.imageService.pushFile(files, response.id).subscribe({
          next: response => {
            alert("plik załadowany");
            window.location.reload();
          },
          error: err => alert(`Wystąpił błąd: ${err.message}`)
        });

      },
      error: err => alert(`Wystąpił błąd: ${err.message}`)
    });
  }

  getSuperCategories() {
    this.productService.getSuperCategories().subscribe(
      data => {
        this.superCategories = data.map(cat=>cat.name);}
    );
  }

  getProductCategories() {

    const superCategoryName = this.addProductGroup.value.superCategory;
    console.log(superCategoryName);

    this.productService.getProductCategoriesBySuperCategoryName(superCategoryName).subscribe(
      data => {
        this.productCategories = data.map(cat=>cat.name);}
    );
  }

  markImagesTouched() {
    this.images?.markAsTouched();
  }

  uploadImages() {

    var files = this.addProductGroup.controls['images'].value;

    this.imageService.pushFile(files, "9").subscribe({
      next: response => {
        alert("plik załadowany");
        window.location.reload();
      },
      error: err => alert(`Wystąpił błąd: ${err.message}`)
    });
  }

}
