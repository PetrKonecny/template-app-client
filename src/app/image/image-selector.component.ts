import { Component, OnInit} from '@angular/core';
import { ImageService } from './image.service';
import { Image} from './image';
import { ImageSelector} from './image-selector';

@Component({
    selector: 'image-select',
    template: `
            <md-toolbar color="secondary">
            <input type="file" 
               ngFileSelect [options]="options"
               (onUpload)="handleUpload($event)"
            >
            </md-toolbar>
            <image-list [images] = images (onImageClicked) = "onImageClicked($event)"></image-list> `,
    providers: [ImageService]
})

export class ImageSelectorComponent implements OnInit{
    
    errorMessage: string;
    images : Image[];

     
    constructor(private imageSelector: ImageSelector,
    private imageService: ImageService){}
    
    closeSelector(){
        this.imageSelector.closeSelectorWindow();
    }
       
    ngOnInit(){
        this.getImages();
    }
    
    onImageClicked(image: Image){
        this.imageSelector.changeImage(image);
        this.imageSelector.closeSelectorWindow();
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