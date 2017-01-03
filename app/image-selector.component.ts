import { Component, OnInit} from '@angular/core';
import { ImageListComponent} from './image-list.component';
import { ImageService } from './image.service';
import { Image} from './image';
import { ImageSelector} from './image-selector';
import {UPLOAD_DIRECTIVES} from 'ng2-uploader/ng2-uploader';

@Component({
    selector: 'image-select',
    template: `
            <input type="file" 
               [ng-file-select]="options"
               (onUpload)="handleUpload($event)"
            >
            <h2>My Images</h2>
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
        console.log(image)
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