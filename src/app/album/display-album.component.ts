import { Component, OnInit, Input} from '@angular/core';
import { AlbumHttpService } from '../album/album-http.service'
import { Album} from '../album/album'
import { MdDialog } from '@angular/material'
import { MdSnackBar } from '@angular/material';
import { ActivatedRoute} from '@angular/router';
import { UploadComponent } from '../uploader.component'
import { AppConfig } from '../app.config'
import { SelectAlbumModal } from '../album/select-album.modal'
import {AppComponentRef} from '../app.ref'
import { Image} from '../image/image';
import { ImageService } from '../image/image.service'

@Component({
    selector: 'display-album',
    template: `
        <div class="shutter">
          <md-spinner *ngIf="loading && !error"></md-spinner>
          <md-icon class="shutter" style="font-size: 96px; opacity: 0.1;" *ngIf="error">error</md-icon>
        </div>
        <md-toolbar style="position: fixed; z-index:1000;">
            <h3>{{album?.name}}</h3>
            <button *ngIf="selected.length" md-button (click)="onDeleteClicked()">Smazat výběr</button>
            <button *ngIf="selected.length" md-button (click)="openAlbumsModal()">Přesunout výběr</button>
        </md-toolbar>
        <button md-fab class="index-button" (click)="openUploadModal()"><md-icon>add</md-icon></button>
        <image-list *ngIf="album && album.images" (onImageClicked)="onSelected($event)" [images] = "album.images"></image-list>
    `,
    styles:[`
        
    `]
})

export class DisplayAlbumComponent implements OnInit  {
    
    error: string;
    album : Album;
    selected = new Array
    shift = false
    loading = true

    constructor(
        private imageService: ImageService, private albumService: AlbumHttpService, public dialog: MdDialog, private snackBar: MdSnackBar, private route: ActivatedRoute,  private config: AppConfig, private ref: AppComponentRef 
    ){
        this.ref.shiftPRess.subscribe(press => this.shift = press) 
    }
    
    
    ngOnInit(){
        this.getImages()
    }

    openUploadModal() {
        let dialogRef = this.dialog.open(UploadComponent, {
          height: '90%',
          width: '60%',
        });
        dialogRef.componentInstance.uploadUrl = this.config.getConfig('api-url')+'/album/'+this.album.id+'/upload'
        dialogRef.componentInstance.onCompleteAll.subscribe(()=>
          this.getImages()
        )        
    }

    openAlbumsModal() {
        let dialogRef = this.dialog.open(SelectAlbumModal, {
          height: '90%',
          width: '60%',
        });
        dialogRef.afterClosed().subscribe((album)=>{
            if(album){
                this.albumService.moveImages(this.selected,album).subscribe(()=>
                {
                    this.getImages()
                },error=>{
                   this.snackBar.open("Chyba při přesunu obrázků",null,{duration: 1500})
                })
            }
        })
    }

    onDeleteClicked(){
        this.selected.forEach((image)=>{
           this.imageService.removeImage(image).subscribe(
               ()=>{
                   this.album.images.splice(this.album.images.indexOf(image),1)
               },
               error =>{
                   this.snackBar.open("Chyba při mazání obrázku",null,{duration: 1500})
               }
           )
        })
    }

    onSelected(image: Image){
        if(!this.shift){
            this.selected.forEach(image => image.selected = false)
            this.selected = new Array
        }
        image.selected = true
        this.selected.push(image)
    }
    
    getImages(){
       this.route.params
        .flatMap((params)=>this.albumService.getAlbum(params['id']))
        .first()
        .subscribe(
            album=> {
                this.album = album
                this.loading = false
            },
            error=> {
                this.error = error
                this.snackBar.open("Chyba při načítání alba",null,{duration: 1500})
            }
        )
    }
}