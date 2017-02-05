import { Component, OnInit} from '@angular/core';
import { ImageService } from './image.service';
import { Image} from './image';



@Component({
    selector: 'image-index',
    template: `
        <input type="file" 
               ngFileSelect [options]="options"
               (onUpload)="handleUpload($event)"
        >
        <image-list [images] = images></image-list>
    `,
    providers: [ImageService]
})

export class ImageIndexComponent implements OnInit  {
    
    errorMessage: string;
    images : Image[];

    constructor(
        private imageService: ImageService 
    ){ }
    
    
    ngOnInit(){
        this.getImages();
    }
    
    getImages(){
        this.imageService.getImages().subscribe(
                               images => this.images = images,
                               error =>  this.errorMessage = <any>error
        );
    }
    
    uploadFile: any;
    options: Object = {
        url: 'http://localhost:8080/image'
    };

    handleUpload(data): void {
      console.log(data);
      if (data && data.done) {
          console.log('done');
          this.getImages();
      }
    }
}