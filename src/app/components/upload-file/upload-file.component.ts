import { Component, EventEmitter, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ImageService } from 'src/app/services/image.service';

@Component({
  selector: 'app-upload-file',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: UploadFileComponent,
    multi: true
  }],
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.css']
})
export class UploadFileComponent implements OnInit, ControlValueAccessor {

  selectedFiles: File[] = [];
  onChange: Function | undefined;
  onTouch: Function | undefined;
  touched = false;

  

  constructor(private imageService: ImageService,
              private route: ActivatedRoute) { }


  writeValue(value: null): void {
    this.selectedFiles = [];
  }
  registerOnChange(fn: any) { this.onChange = fn;  };
  registerOnTouched(fn: any) { this.onTouch = fn;  }

  ngOnInit(): void {
  }

  selectFile(event: any) {
    this.selectedFiles.push(...event.addedFiles);
    if(this.onChange) this.onChange(this.selectedFiles);
  }
  
  onRemove(event: File) {
    this.selectedFiles.splice(this.selectedFiles.indexOf(event), 1);
    if(this.onChange) this.onChange(this.selectedFiles);
  }

  markAsTouched() {
    if (!this.touched) {
      this.onTouch!();
      this.touched = true;
    }
  }
  
  uploadFile() {
    const productId = this.route.snapshot.paramMap.get("id")!;
  
    this.imageService.pushFile(this.selectedFiles, productId).subscribe({
      next: response => {
        alert("plik załadowany");
        window.location.reload();
      },
      error: err => alert(`Wystąpił błąd: ${err.message}`)
    });
  }

}
