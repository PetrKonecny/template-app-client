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
import { UserStore } from '../user/user.store'
import { AlbumStore } from '../album/album.store'
import { AlbumHelper } from '../album/album.helper'

@Component({
    selector: 'display-album',
    template: `
        <md-toolbar>
            <h1 class="album-chip">{{album?.name}}</h1>
            <div style="padding-right: 16px;" >
            <button *ngIf="selected.length && helper.canDeleteAlbum(currentUser,album)" md-button (click)="onDeleteClicked()">SMAZAT VÝBĚR</button>
            <button *ngIf="selected.length&& helper.canEditAlbum(currentUser,album)" md-button (click)="openAlbumsModal()">PŘESUNOUT VÝBĚR</button>
            </div>
        </md-toolbar>
        <md-progress-bar mode="indeterminate" *ngIf="loading && !error"></md-progress-bar>
        <div class="shutter" *ngIf="error">
                <md-icon style="font-size: 96px; opacity: 0.1;">error</md-icon>
        </div>
        <div class ="index-content">
        <button *ngIf="currentUser && album && currentUser.id == album.user_id" md-fab class="index-button" (click)="openUploadModal()"><md-icon>add</md-icon></button>
        <div class="mat-elevation-z4 image-list">
        <image-list *ngIf="album && album.images" (onImageClicked)="onSelected($event)" [images] = "album.images"></image-list>
        </div>
        </div>
    `,
    styles:[`
        
    `]
})
//displays images inside the album
export class DisplayAlbumComponent implements OnInit  {
    
    //error thrown while loading albums
    error: string;
    //album to be displayed
    album : Album;
    //selected images in the album
    selected = new Array
    //whether the shift key is being held or not
    shift = false
    //loading indicator
    loading = true
    helper = AlbumHelper

    currentUser

    /**
    @param imageService - http service used to manipulate images
    @param albumService - service used to load album
    @param dialog - service used for displaying the dialog
    @param snackBar - service used to display snacbar with errors
    @param route - current route containing params
    @param config - configuration used to get API URl
    @param ref - refference to the root component 
    **/
    constructor(
        private albumStore: AlbumStore, private userStore: UserStore, private imageService: ImageService, private albumService: AlbumHttpService, public dialog: MdDialog, private snackBar: MdSnackBar, private route: ActivatedRoute,  private config: AppConfig, private ref: AppComponentRef 
    ){
        this.ref.shiftPRess.subscribe(press => this.shift = press) 
        this.userStore.user.first(user =>(user && user.id > 0)).subscribe(user => this.currentUser = user)
    }
    
    //gets the images
    ngOnInit(){
        this.getImages()
    }

    //opens modal to upload images
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

    //opens modal to choose between albums
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
        this.albumStore.content.first().subscribe((res)=>{
            let albums = res.albums.filter(album=>AlbumHelper.canEditAlbum(this.currentUser,album))
            dialogRef.componentInstance.albums = albums
        })
    }

    //triggered when delete button clicked
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

    //triggered when image selected
    onSelected(image: Image){
        if(!this.shift){
            this.selected.forEach(image => image.selected = false)
            this.selected = new Array
        }
        image.selected = true
        this.selected.push(image)
    }
    
    //calls service to get images from API
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