import { Component, OnInit} from '@angular/core';
import { ImageService } from './image.service';
import { Image} from './image';
import {AppConfig} from '../app.config'
import { ImageUploadComponent } from './image-upload.component'
import { MdDialog } from '@angular/material'
import { PageStore} from '../page/page.store'

@Component({
    selector: 'image-select',
    template: `
            <md-toolbar color="secondary">
              <button md-icon-button md-raised-button (click)="openUploadModal()"><md-icon>add</md-icon></button>
            </md-toolbar>
            <div class = "shutter">
              <md-spinner class="spinner" *ngIf="loading && !error"></md-spinner>
              <md-icon *ngIf="error">error</md-icon>
            </div>
            <image-list [images] = images (onImageClicked) = "onImageClicked($event)"></image-list> `,
    styles: [`
            .shutter{
            position: absolute;
            pointer-events: none;
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;}
            `]
})

export class ImageSelectorComponent implements OnInit{
    
    error: string;
    images : Image[];
    loading: boolean = true

     
    constructor(
    private imageService: ImageService, private appConfig: AppConfig, public dialog: MdDialog, pageStore: PageStore){}
       
    ngOnInit(){
        this.getImages();
    }
   
    getImages(){
        this.imageService.getImages().first().subscribe(
                               images => {
                                 this.images = images
                                 this.loading = false
                               },
                               error =>  this.error = <any>error
        );
    }
    
   openUploadModal() {
        let dialogRef = this.dialog.open(ImageUploadComponent, {
          height: '90%',
          width: '60%',
        });
        dialogRef.afterClosed().subscribe(closed =>{
          this.getImages()
        })        
    }
    
}