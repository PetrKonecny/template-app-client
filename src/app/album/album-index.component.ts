import { Component, OnInit} from '@angular/core';
import { AlbumHttpService } from '../album/album-http.service'
import { Album} from '../album/album'
import { MdDialog } from '@angular/material'
import  { AppComponentRef } from '../app.ref'
import { Router } from '@angular/router'
import { MdSnackBar } from '@angular/material';


@Component({
    selector: 'album-index',
    template: `
        <div class="shutter">
          <md-spinner *ngIf="loading && !error"></md-spinner>
          <md-icon class="shutter" style="font-size: 96px; opacity: 0.1;" *ngIf="error">error</md-icon>
        </div>
        <button md-fab class="index-button"><md-icon>add</md-icon></button>
        <album-list *ngIf="albums" (onAlbumClicked)="onSelected($event)" [albums] = "albums"></album-list>
    `,
    styles:[`
        
    `]
})

export class AlbumIndexComponent implements OnInit  {
    
    error: string;
    albums : Album[];
    loading = true

    constructor(
        private albumService: AlbumHttpService, public dialog: MdDialog, private router: Router, private snackBar: MdSnackBar
    ){ 
    }
    
    
    ngOnInit(){
        this.albumService.getAlbums().subscribe(
           albums => {
               this.albums = albums
               this.loading = false
           },
           error =>  {   
               this.error = error
               this.snackBar.open("Chyba při načítání alb",null,{duration: 1500})
           }
        )
    }

    onSelected(album: Album){
       this.router.navigate(['albums',album.id])
    }
}