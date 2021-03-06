import { Component, OnInit, Input} from '@angular/core';
import { AlbumHttpService } from '../album/album-http.service'
import { Album} from '../album/album'
import { MdDialog } from '@angular/material'
import { AppComponentRef} from '../app.ref'
import { MdSnackBar } from '@angular/material';
import { UploadComponent } from '../uploader.component'
import { AppConfig } from '../app.config'
import { ImageUploadComponent } from '../image/image-uploader.component'
import {UserStore} from '../user/user.store'
import { AlbumHelper } from '../album/album.helper'

@Component({
    selector: 'display-album-sidenav',
    template: `
        <div class="shutter">
          <md-spinner *ngIf="loading && !error"></md-spinner>
          <md-icon class="shutter" style="font-size: 96px; opacity: 0.1;" *ngIf="error">error</md-icon>
        </div>
        <image-list *ngIf="album && album.images" [showAddTile]="showAddTile()" (onAddImageClicked)="openUploadModal()" (onImageClicked)="onSelected($event)" [images] = "album.images"></image-list>
    `,
    styles:[`
        
    `]
})

//displays album details in the sidenav
export class DisplayAlbumSidenavComponent implements OnInit  {
    
    //error thrown when loading images
    error: string;
    @Input()
    //album containing the images
    album : Album;
    //loading indicator
    loading = true

    currentUser

    /**
    @param albumService - service to load the albums
    @param dialog - dialog service used to display dialogs
    @param snackBar - snackbar to display error on
    @param config - contains API address
    */
    constructor(
        private userStore: UserStore, private albumService: AlbumHttpService, public dialog: MdDialog, private snackBar: MdSnackBar, private config: AppConfig
    ){ 
    }

    showAddTile(){
        return AlbumHelper.canEditAlbum(this.currentUser, this.album)
    }
    
    
    ngOnInit(){
        this.userStore.user.first(user => (user && user.id > 0)).do(user => this.currentUser = user).subscribe()
        this.getImages()
    }

    onSelected(album: Album){
    }

    //opens dialog to upload new images into the album
    openUploadModal() {
        let dialogRef = this.dialog.open(ImageUploadComponent, {
          height: '60%',
          width: '60%',
        });
        dialogRef.componentInstance.uploadUrl = this.config.getConfig('api-url')+'/album/'+this.album.id+'/upload'
        dialogRef.componentInstance.onCompleteAll.subscribe(()=>{
              this.getImages()
              dialogRef.close()
          }
        )        
    }

    onDeleteClicked(){
    }
    
    //loads images from the API
    getImages(){
        this.albumService.getAlbum(this.album.id)
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