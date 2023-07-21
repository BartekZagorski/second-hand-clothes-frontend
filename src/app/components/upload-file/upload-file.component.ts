import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ImageService } from 'src/app/services/image.service';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.css']
})
export class UploadFileComponent implements OnInit {

  selectedFiles: File[] = [];

  constructor(private imageService: ImageService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
  }

  selectFile(event: any) {
    this.selectedFiles.push(...event.addedFiles);
    console.log(this.selectedFiles);
  }
  
  onRemove(event: File) {
    console.log(event);
    this.selectedFiles.splice(this.selectedFiles.indexOf(event), 1);
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
