import { Component, OnInit} from '@angular/core';
import { ImageService } from './image.service';
import { Image} from './image';
import { ImageUploadComponent } from './image-upload.component'
import { MdDialog } from '@angular/material'


@Component({
    selector: 'image-index',
    template: `
        <button md-fab (click)="openUploadModal()"><md-icon>add</md-icon></button>
        <image-list [images] = images></image-list>
    `,
    providers: [ImageService]
})

export class ImageIndexComponent implements OnInit  {
    
    errorMessage: string;
    images : Image[];

    constructor(
        private imageService: ImageService, public dialog: MdDialog 
    ){ }
    
    
    ngOnInit(){
        this.getImages();
    }

    openUploadModal() {
        let dialogRef = this.dialog.open(ImageUploadComponent, {
          height: '90%',
          width: '60%',
        });        
    }
    
    getImages(){
        this.imageService.getImages().subscribe(
                               images => this.images = images,
                               error =>  this.errorMessage = <any>error
        );
    }
}