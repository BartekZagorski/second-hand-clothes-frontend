import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ImageService } from 'src/app/services/image.service';

@Component({
  selector: 'app-images',
  templateUrl: './images.component.html',
  styleUrls: ['./images.component.css']
})
export class ImagesComponent implements OnInit {

  public images: string[] = [];

  constructor(private imageService: ImageService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.fetchImages();
  }

  fetchImages() {
    const id = +this.route.snapshot.paramMap.get("id")!;

    this.imageService.getProductImageUrlList(id).subscribe(
      data => {
        this.images = data;
      }
    );
  }



}
