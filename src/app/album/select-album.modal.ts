import { Component, Input} from '@angular/core'
import { Observable }     from 'rxjs/Observable'
import { FormBuilder, Validators } from '@angular/forms'
import {MdDialogRef} from '@angular/material'
import { Album } from '../album/album'
import { AlbumHttpService } from '../album/album-http.service'
import { AlbumStore } from '../album/album.store'

@Component({
    selector: 'album-select-modal',
    template: `
        <album-list *ngIf="albums" [albums]="albums" (onAlbumClicked)="onAlbumSelected($event)"></album-list>
    `,
    providers: []
})

//dialog that presents albums to choose from
export class SelectAlbumModal  {
    
    @Input()
    //albums to choose from
    albums: Album[]

    /**
    @param ref - reference to close the dialog
    @param service - service to load albums from
    */
    constructor(private ref: MdDialogRef<SelectAlbumModal>, private store: AlbumStore){}

    ngOnInit(){
        this.store.content.subscribe(res =>{
            this.albums = res.albums
        })
    }

    onAlbumSelected(album: Album){
        this.ref.close(album)
    }
     
}