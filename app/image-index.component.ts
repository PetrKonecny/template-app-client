import { Component, OnInit} from '@angular/core';
import { ImageListComponent} from './image-list.component';
import { ImageService } from './image.service';
import { Image} from './image';
import { Observable }     from 'rxjs/Observable';
import {UPLOAD_DIRECTIVES} from 'ng2-uploader/ng2-uploader';



@Component({
    selector: 'image-index',
    template: `
        <input type="file" 
               [ng-file-select]="options"
               (onUpload)="handleUpload($event)"
        >
        <h2>My Images</h2>
        <image-list [images] = images></image-list>
    `,
    directives: [ImageListComponent,UPLOAD_DIRECTIVES],
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