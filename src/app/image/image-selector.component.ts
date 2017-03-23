import { Component, OnInit} from '@angular/core';
import { ImageService } from './image.service';
import { Image} from './image';
import {AppConfig} from '../app.config'
import { ImageUploadComponent } from './image-upload.component'
import { MdDialog } from '@angular/material'

@Component({
    selector: 'image-select',
    template: `
            <md-toolbar color="secondary">
            <button md-icon-button md-raised-button (click)="openUploadModal()"><md-icon>add</md-icon></button>
            </md-toolbar>
            <image-list [images] = images (onImageClicked) = "onImageClicked($event)"></image-list> `,
    providers: [ImageService]
})

export class ImageSelectorComponent implements OnInit{
    
    errorMessage: string;
    images : Image[];

     
    constructor(
    private imageService: ImageService, private appConfig: AppConfig, public dialog: MdDialog ){}
       
    ngOnInit(){
        this.getImages();
    }
   
    getImages(){
        this.imageService.getImages().subscribe(
                               images => this.images = images,
                               error =>  this.errorMessage = <any>error
        );
    }
    
   openUploadModal() {
        let dialogRef = this.dialog.open(ImageUploadComponent, {
          height: '90%',
          width: '60%',
        });
        dialogRef.afterClosed().subscribe(closed =>{
          this.imageService.getImages().repeat()
        })        
    }
    
}