import { Component, Input, Output, EventEmitter} from '@angular/core';
import { Album } from '../album/album';

@Component({
    selector: 'album-list',
    template: `
            <div class="shutter">
                <h3 *ngIf="albums && albums.length == 0" class="nothing-found">Žádná alba k zobrazení</h3>
            </div>            
            <md-grid-list  [cols]="cols">
                <md-grid-tile *ngFor="let album of albums" (click)="onSelect(album)">
                    <div style="display: flex; align-items: center; justify-content: center; width: 90%; height: 90%; background: gainsboro; text-align: center;">
                        <h3>{{album.name ? album.name : 'album'}}</h3>
                    </div>           
                </md-grid-tile>
            </md-grid-list> `,
    styles: [`                         
            `]
})

export class AlbumListComponent {
     
    @Input()
    albums : Album[] 
    @Input()
    cols = 5;
    @Output() onAlbumClicked = new EventEmitter<Album>();
        
    onSelect(album: Album) {
        this.onAlbumClicked.emit(album);
    }    
}