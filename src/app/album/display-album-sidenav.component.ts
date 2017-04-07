import { Component, OnInit} from '@angular/core';
import { AlbumHttpService } from './album-http.service';
import { Album} from './album';
import { AppConfig } from '../app.config'
import { UploadComponent } from '../uploader.component'
import { MdDialog } from '@angular/material'
import { PageStore} from '../page/page.store'

@Component({
    selector: 'album-select',
    template: `
            <md-toolbar color="secondary">
              <button md-icon-button md-raised-button (click)="openUploadModal()"><md-icon>add</md-icon></button>
            </md-toolbar>
            <div class = "shutter">
              <md-spinner class="spinner" *ngIf="loading && !error"></md-spinner>
              <md-icon *ngIf="error">error</md-icon>
            </div>
            <album-list [albums] = albums (onAlbumClicked) = "onAlbumClicked($event)"></album-list> `,
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

export class DisplayAlbumSidenav implements OnInit{
    
    error: string;
    album : Album[];
    loading: boolean = true

     
    constructor(
    private albumService: AlbumHttpService, private appConfig: AppConfig, public dialog: MdDialog, pageStore: PageStore, private config: AppConfig){}
       
    ngOnInit(){
        this.getAlbums();
    }
   
    getAlbums(){
        this.albumService.getAlbums().first().subscribe(
                               albums => {
                                 this.albums = albums
                                 this.loading = false
                               },
                               error =>  this.error = <any>error
        );
    }
    
   openUploadModal() {
        let dialogRef = this.dialog.open(UploadComponent, {
          height: '90%',
          width: '60%',
        });
        dialogRef.componentInstance.uploadUrl = this.config.getConfig('api-url')+'/album'
        dialogRef.componentInstance.onCompleteAll.subscribe(()=>
          this.getAlbums()
        )        
    }
    
}