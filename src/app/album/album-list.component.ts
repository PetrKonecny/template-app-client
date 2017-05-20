import { Component, Input, Output, EventEmitter} from '@angular/core';
import { Album } from '../album/album';
import { User } from '../user/user'

@Component({
    selector: 'album-list',
    template: `
            <div class="shutter">
                <h3 *ngIf="albums && albums.length == 0" class="nothing-found">Žádná alba k zobrazení</h3>
            </div>
            <div class="list-wrapper">            
                <md-grid-list  [cols]="cols">
                    <md-grid-tile (click)="onSelect(album)" *ngFor="let album of albums">
                        <div class="album" [class.public-album]="album.public" style="display: flex; align-items: center; justify-content: center; width: 90%; height: 90%; background: gainsboro; text-align: center;">
                            <button *ngIf="user && album.user_id == user.id" md-icon-button (click)="onClick($event)" [mdMenuTriggerFor]="albumMenu" style="position:absolute; right:0; top:0; margin: 12px;"><md-icon>more_vert</md-icon></button>
                            <md-menu #albumMenu="mdMenu">
                              <button md-menu-item (click)="onDeleteAlbum(album)">
                                <span>Smazat album</span>
                              </button>
                              <button md-menu-item (click)="onEditAlbum(album)">
                                <span>Upravit vlastnosti alba</span>
                              </button>
                            </md-menu>
                            <h3>{{album.name ? album.name : 'album'}}</h3>
                        </div>           
                    </md-grid-tile>
                </md-grid-list> 
            </div>
            `,
    styles: [`                         
            `]
})
//displays grid of albums with different color depending on their visibility
export class AlbumListComponent {
     
    @Input()
    //array of albums to display
    albums : Album[] 

    @Input()
    //number of columns in the grid
    cols = 5;

    @Input()
    //currently logged in user
    user: User

    @Output() 
    //triggered on album clicked
    onAlbumClicked = new EventEmitter<Album>();

    @Output() 
    //triggered on edit clicked
    onEditClicked = new EventEmitter<Album>();

    @Output() 
    //trigered on delete clicked
    onDeleteClicked = new EventEmitter<Album>();

    //makes album menu not click the album
    onClick(event) {
       event.stopPropagation();
    }
       
   //triggered on album clicked
    onSelect(album: Album) {
        this.onAlbumClicked.emit(album);
    }    

    //trigered on edit clicked
    onEditAlbum(album: Album){
        this.onEditClicked.emit(album);
    }

    //trigered on delete clicked
    onDeleteAlbum(album: Album){
        this.onDeleteClicked.emit(album)
    }
}