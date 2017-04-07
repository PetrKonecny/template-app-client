import { Component, OnInit, Input, ViewChild} from '@angular/core';
import { AlbumHttpService } from '../album/album-http.service'
import { Album} from '../album/album'
import { MdDialog } from '@angular/material'
import { AppComponentRef} from '../app.ref'
import { MdSnackBar } from '@angular/material';
import { ActivatedRoute} from '@angular/router';
import { UploadComponent } from '../uploader.component'
import { AppConfig } from '../app.config'
import { SaveAlbumModal } from '../album/save-album.modal'

@Component({
    selector: 'album-index-sidenav',
    template: `
        <div class="shutter">
          <md-spinner *ngIf="loading && !error"></md-spinner>
          <md-icon class="shutter" style="font-size: 96px; opacity: 0.1;" *ngIf="error">error</md-icon>
        </div>
        <md-toolbar *ngIf="selectedAlbum"><button md-icon-button (click)="onBackClicked($event)"><md-icon>arrow_back</md-icon></button><h4>{{selectedAlbum.name ? selectedAlbum.name : 'nepojmenované album'}}</h4></md-toolbar>
        <button md-fab class="index-button" (click)="onAddClicked()"><md-icon>add</md-icon></button>
        <album-list *ngIf="!selectedAlbum && albums" (onAlbumClicked)="onSelected($event)" [albums] = "albums" [cols]="3"></album-list>
        <display-album-sidenav #albumDetail *ngIf="selectedAlbum" [album]="selectedAlbum"></display-album-sidenav>
    `,
    styles:[`
        
    `]
})

export class AlbumIndexSidenavComponent implements OnInit  {
    
    error: string;
    albums: Album[];
    selectedAlbum : Album;
    loading = true

    @ViewChild('albumDetail')
    albumDetail

    constructor(
        private albumService: AlbumHttpService, public dialog: MdDialog, private snackBar: MdSnackBar, private route: ActivatedRoute,  private config: AppConfig
    ){ 
    }
    
    
    ngOnInit(){
        this.getAlbums()
    }

    onSelected(album: Album){
        this.selectedAlbum = album
    }

    openUploadModal() {
           
    }

    onDeleteClicked(){
    }

    onBackClicked(){
        this.selectedAlbum = null
    }

    onAddlicked(){
        if(this.selectedAlbum){
            this.openUploadDialog()
        }else{
            this.openNewAlbumDialog()
        }

    }

    openUploadDialog() {
        let dialogRef = this.dialog.open(UploadComponent, {
          height: '90%',
          width: '60%',
        });
        dialogRef.componentInstance.uploadUrl = this.config.getConfig('api-url')+'/album/'+this.selectedAlbum.id +'/upload'
        dialogRef.componentInstance.onCompleteAll.subscribe(()=>
              this.albumDetail.getImages()
        )        
    }

    openNewAlbumDialog(){
        let dialogRef = this.dialog.open(SaveAlbumModal, {
          height: 'auto',
          width: '30%',
        });
        dialogRef.afterClosed().subscribe(value => 
            {
                if(value == 'save'){
                    this.albumService.addAlbum(dialogRef.componentInstance.album).subscribe(album=>{
                         this.albums.push(album)
                    },error=>{
                        this.snackBar.open("Chyba při vytváření alba",null,{duration: 2500})
                    })
                }
            }
        )
        dialogRef.componentInstance.album = new Album        
    }
    
    getAlbums(){
        this.albumService.getAlbums()
        .first()
        .subscribe(
            albums=> {
                this.albums = albums
                this.loading = false
            },
            error=> {
                this.error = error
                this.snackBar.open("Chyba při načítání alb",null,{duration: 1500})
            }
        )
    }
}