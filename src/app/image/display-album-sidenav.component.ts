import { Component, OnInit, Input} from '@angular/core';
import { AlbumHttpService } from '../album/album-http.service'
import { Album} from '../album/album'
import { MdDialog } from '@angular/material'
import { AppComponentRef} from '../app.ref'
import { MdSnackBar } from '@angular/material';
import { ActivatedRoute} from '@angular/router';
import { UploadComponent } from '../uploader.component'
import { AppConfig } from '../app.config'

@Component({
    selector: 'display-album-sidenav',
    template: `
        <div class="shutter">
          <md-spinner *ngIf="loading && !error"></md-spinner>
          <md-icon class="shutter" style="font-size: 96px; opacity: 0.1;" *ngIf="error">error</md-icon>
        </div>
        <image-list *ngIf="album && album.images" (onImageClicked)="onSelected($event)" [images] = "album.images"></image-list>
    `,
    styles:[`
        
    `]
})

export class DisplayAlbumSidenavComponent implements OnInit  {
    
    error: string;
    @Input()
    album : Album;
    loading = true

    constructor(
        private albumService: AlbumHttpService, public dialog: MdDialog, private snackBar: MdSnackBar, private route: ActivatedRoute,  private config: AppConfig
    ){ 
    }
    
    
    ngOnInit(){
        this.getImages()
    }

    onSelected(album: Album){
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

    onDeleteClicked(){
    }
    
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