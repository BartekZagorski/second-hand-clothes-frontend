import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ImageService } from 'src/app/services/image.service';
import { Image } from 'src/app/common/image';

@Component({
  selector: 'app-images',
  templateUrl: './images.component.html',
  styleUrls: ['./images.component.css']
})
export class ImagesComponent implements OnInit {

  public images: Image[] = [];

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
