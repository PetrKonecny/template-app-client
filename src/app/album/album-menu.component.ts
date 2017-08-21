import { Component, Input, Output, EventEmitter} from '@angular/core';
import { Album } from '../album/album';
import { User } from '../user/user'
import { SaveAlbumModal } from '../album/save-album.modal'
import { MdDialog } from '@angular/material'
import { MdSnackBar } from '@angular/material';
import { AlbumHttpService } from '../album/album-http.service'

@Component({
    selector: 'album-menu',
    template: `
            <button md-icon-button (click)="onClick($event)" [mdMenuTriggerFor]="albumMenu"><md-icon>more_vert</md-icon></button>
            <md-menu #albumMenu="mdMenu">
              <button md-menu-item (click)="onDeleteAlbum(album)">
                <span>Smazat album</span>
              </button>
              <button md-menu-item (click)="onEditAlbum(album)">
                <span>Upravit vlastnosti alba</span>
              </button>
            </md-menu>
            `,
    styles: [`                         
            `]
})
//displays grid of albums with different color depending on their visibility
export class AlbumMenuComponent {
     
    @Input()
    //array of albums to display
    album : Album 

    constructor(private dialog: MdDialog, private albumService: AlbumHttpService, private snackBar: MdSnackBar ){}

    @Output() 
    //triggered on edit clicked
    afterAlbumDeleted = new EventEmitter<Album>();

    @Output() 
    //trigered on delete clicked
    afterAlbumEdited = new EventEmitter<Album>();

    //makes album menu not click the album
    onClick(event) {
       event.stopPropagation();
    }
       
    //trigered on edit clicked
    onEditAlbum(album: Album){
        let dialogRef = this.dialog.open(SaveAlbumModal, {
          height: 'auto',
          width: '30%',
        });
        dialogRef.afterClosed().subscribe(value => 
            {
                if(value){
                    let album2 = new Album
                    album2.id = album.id
                    album2.name = value.name
                    album2.tagged = value.tagged
                    album2.public = value.public
                    delete album2.images;
                    this.albumService.updateAlbum(album2).subscribe(updatedAlbum=>{
                        this.afterAlbumEdited.emit(updatedAlbum)
                    },error=>{
                        this.snackBar.open("Chyba při aktualizaci alba",null,{duration: 2500})
                    })
                }
            }
        )
        dialogRef.componentInstance.setAlbum(album)
    }

    //trigered on delete clicked
    onDeleteAlbum(album: Album){
       this.albumService.removeAlbum(album.id).subscribe(()=>{
           this.afterAlbumDeleted.emit(album)
        },error =>{                        
            this.snackBar.open("Chyba při mazání alba",null,{duration: 2500})})
    }
}