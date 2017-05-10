import { Component, OnInit} from '@angular/core';
import { AlbumHttpService } from '../album/album-http.service'
import { Album} from '../album/album'
import { MdDialog } from '@angular/material'
import  { AppComponentRef } from '../app.ref'
import { Router } from '@angular/router'
import { MdSnackBar } from '@angular/material';
import { SaveAlbumModal } from '../album/save-album.modal'


@Component({
    selector: 'admin-albums',
    template: `
      <album-table [albums] = "albums" [loadingIndicator]="loading" (onOpen) = "onSelected($event)" (onDelete) = "onDeleteClicked($event)"></album-table>
    `,
    styles:[`
        
    `]
})

export class AdminAlbumsComponent implements OnInit  {
    
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
       this.router.navigate(['/admin/albums',album.id])
    }
}