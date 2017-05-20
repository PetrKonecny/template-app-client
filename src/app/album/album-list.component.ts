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

export class AlbumListComponent {
     
    @Input()
    albums : Album[] 

    @Input()
    cols = 5;

    @Input()
    user: User

    @Output() 
    onAlbumClicked = new EventEmitter<Album>();

    @Output() 
    onEditClicked = new EventEmitter<Album>();

    @Output() 
    onDeleteClicked = new EventEmitter<Album>();

    onClick(event) {
       event.stopPropagation();
    }
   
    onSelect(album: Album) {
        this.onAlbumClicked.emit(album);
    }    

    onEditAlbum(album: Album){
        this.onEditClicked.emit(album);
    }

    onDeleteAlbum(album: Album){
        this.onDeleteClicked.emit(album)
    }
}