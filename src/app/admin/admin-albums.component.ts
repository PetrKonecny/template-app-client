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

//displays album index in admin section
export class AdminAlbumsComponent implements OnInit  {
    
    //error when loading albums
    error: string;
    //array of albums to display
    albums : Album[];
    //loading indicator
    loading = true

    /**
    @param albumService - service to get albums from API
    */
    constructor(
        private albumService: AlbumHttpService, public dialog: MdDialog, private router: Router, private snackBar: MdSnackBar
    ){ 
    }
    
    //gets albums from API
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

    onDeleteClicked(){}

    //triggered on album clicked
    onSelected(album: Album){
       this.router.navigate(['/admin/albums',album.id])
    }
}