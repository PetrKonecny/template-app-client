import { Component, Input, Output, EventEmitter} from '@angular/core';
import { Album } from '../album/album';
import { User } from '../user/user'
import { SaveAlbumModal } from '../album/save-album.modal'
import { MdDialog } from '@angular/material'
import { MdSnackBar } from '@angular/material';
import { AlbumHttpService } from '../album/album-http.service'

@Component({
    selector: 'album-list',
    template: `
            <div class="shutter ">
                <h3 *ngIf="albums && albums.length == 0" class="nothing-found">Žádná alba k zobrazení</h3>
            </div>
            <div class="list-wrapper">            
                <md-grid-list  [cols]="cols" *ngIf="grid">
                    <md-grid-tile (click)="onSelect(album)" *ngFor="let album of albums">
                        <div class="album" [class.public-album]="album.public">
                            <album-menu [album]="album" (afterAlbumEdited)="onEditAlbum(album)" (afterAlbumDeleted)="onDeleteAlbum(album)"></album-menu>
                            <h4>{{album.name ? album.name : 'album'}}</h4>
                        </div>           
                    </md-grid-tile>
                    <md-grid-tile *ngIf="showAddTile" md-tooltip="nové album">
                        <button (click)="onAddAlbumClicked.emit()" class="album plus-album">
                            <md-icon>add</md-icon>
                        </button>
                    </md-grid-tile>
                </md-grid-list>

                <md-nav-list *ngIf="!grid">
                    <md-list-item [routerLink] = "['/albums', album.id]" *ngFor="let album of albums">
                        <span md-line>{{ album.name }}</span>
                        <md-chip-list md-line><md-chip *ngFor="let tag of album.tagged">{{tag.tag_name}}</md-chip></md-chip-list>
                        <album-menu [album]="album" (afterAlbumEdited)="onEditAlbum($event)" (afterAlbumDeleted)="onDeleteAlbum($event)"></album-menu>
                    </md-list-item>
                </md-nav-list> 
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

    constructor(private dialog: MdDialog, private albumService: AlbumHttpService, private snackBar: MdSnackBar ){}

    @Input()
    //number of columns in the grid
    cols = 5;

    @Input()
    grid: boolean = true;

    @Input()
    //currently logged in user
    user: User

    @Input()
    showAddTile: boolean

    @Output() 
    //triggered on album clicked
    onAlbumClicked = new EventEmitter<Album>();

    @Output() 
    //triggered on album clicked
    onAddAlbumClicked = new EventEmitter<null>();

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
        let searchedAlbum = this.albums.filter(album2 => album2.id === album.id )[0]
        this.albums.splice(this.albums.indexOf(searchedAlbum) ,1 ,album)
    }

    //trigered on delete clicked
    onDeleteAlbum(album: Album){
        this.albums.splice(this.albums.indexOf(album) ,1 )
    }
}