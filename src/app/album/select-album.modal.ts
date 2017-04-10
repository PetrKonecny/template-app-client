import { Component, Input} from '@angular/core'
import { Observable }     from 'rxjs/Observable'
import { FormBuilder, Validators } from '@angular/forms'
import {MdDialogRef} from '@angular/material'
import { Album } from '../album/album'
import { AlbumHttpService } from '../album/album-http.service'

@Component({
    selector: 'album-select-modal',
    template: `
        <album-list *ngIf="albums" [albums]="albums" (onAlbumClicked)="onAlbumSelected($event)"></album-list>
    `,
    providers: []
})

export class SelectAlbumModal  {
    
    @Input()
    albums: Album[]

    constructor(private ref: MdDialogRef<SelectAlbumModal>, private service: AlbumHttpService){}

    ngOnInit(){
        this.service.getAlbums().subscribe(albums =>{
            this.albums = albums
        })
    }

    onAlbumSelected(album: Album){
        this.ref.close(album)
    }
     
}