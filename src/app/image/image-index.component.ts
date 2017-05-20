import { Component, OnInit} from '@angular/core';
import { ImageService } from './image.service';
import { Image} from './image';
import { ImageUploadComponent } from './image-upload.component'
import { MdDialog } from '@angular/material'
import {AppComponentRef} from '../app.ref'


@Component({
    selector: 'image-index',
    template: `
        <div class="shutter">
          <md-spinner *ngIf="loading && !error"></md-spinner>
          <md-icon class="shutter" style="font-size: 96px; opacity: 0.1;" *ngIf="error">error</md-icon>
        </div>
        <button md-fab class="index-button" (click)="openUploadModal()"><md-icon>add</md-icon></button>
        <md-toolbar *ngIf="selected.length" style="position: fixed; z-index:1000;">
            <button md-button (click)="onDeleteClicked()">Delete</button>
            <button md-button>Move</button>
        </md-toolbar>
        <image-list (onImageClicked)="onSelected($event)" [images] = images></image-list>
    `,
    providers: [ImageService],
    styles:[`
        
    `]
})

//DEPRACATED
export class ImageIndexComponent implements OnInit  {
    
    error: string;
    images : Image[];
    selected = new Array
    shift = false
    loading = true

    constructor(
        private imageService: ImageService, public dialog: MdDialog, private ref: AppComponentRef 
    ){ 
        this.ref.shiftPRess.subscribe(press => this.shift = press)
    }
    
    
    ngOnInit(){
        this.getImages();
    }

    onSelected(image: Image){
        if(!this.shift){
            this.selected.forEach(image => image.selected = false)
            this.selected = new Array
        }
        image.selected = true
        this.selected.push(image)
    }

    openUploadModal() {
        let dialogRef = this.dialog.open(ImageUploadComponent, {
          height: '90%',
          width: '60%',
        });        
    }

    onDeleteClicked(){
        this.imageService.removeImage(this.selected[0].id).subscribe(()=>this.getImages())
        this.selected.forEach(image => image.selected = false)
        this.selected = new Array
    }
    
    getImages(){
        this.imageService.getImages().subscribe(
           images => {
               this.images = images
               this.loading = false
           },
           error =>  this.error = error
        )
    }
}