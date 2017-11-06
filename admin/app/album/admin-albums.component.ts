import { Component, OnInit} from '@angular/core';
import { AlbumHttpService } from '../../../src/app/album/album-http.service'
import { Album} from '../../../src/app/album/album'
import { MdDialog } from '@angular/material'
import { Router } from '@angular/router'
import { MdSnackBar } from '@angular/material';


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

    onDeleteClicked(selected){
        selected.forEach((album)=>{
          this.albumService.removeAlbum(album.id).subscribe(()=>{
              this.albums.splice(this.albums.indexOf(album),1)
          },error =>{                        
              this.snackBar.open("Chyba při mazání alba",null,{duration: 2500})})
         })
    }

    //triggered on album clicked
    onSelected(album: Album){
       this.router.navigate(['/admin/albums',album.id])
    }
}