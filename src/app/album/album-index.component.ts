import { Component, OnInit} from '@angular/core';
import { AlbumHttpService } from '../album/album-http.service'
import { Album} from '../album/album'
import { MdDialog } from '@angular/material'
import  { AppComponentRef } from '../app.ref'
import { Router } from '@angular/router'
import { MdSnackBar } from '@angular/material';
import { SaveAlbumModal } from '../album/save-album.modal'
import {UserStore} from '../user/user.store'
import { Observable }     from 'rxjs/Observable';

@Component({
    selector: 'album-index',
    template: `
        <div class="shutter">
          <md-spinner *ngIf="loading && !error"></md-spinner>
          <md-icon class="shutter" style="font-size: 96px; opacity: 0.1;" *ngIf="error">error</md-icon>
        </div>
        <button md-fab class="index-button" (click)="openNewAlbumDialog()"><md-icon>add</md-icon></button>
        <album-list *ngIf="albums" [user]="currentUser" (onEditClicked)="onEdit($event)" (onDeleteClicked)="onDeleted($event)" (onAlbumClicked)="onSelected($event)" [albums] = "albums"></album-list>
    `,
    styles:[`
        
    `]
})

export class AlbumIndexComponent implements OnInit  {
    
    error: string;
    albums : Album[];
    publicAlbums: Album[]
    loading = true
    currentUser

    constructor(
        private userStore: UserStore, private albumService: AlbumHttpService, public dialog: MdDialog, private router: Router, private snackBar: MdSnackBar
    ){ 
    }
    
    
    ngOnInit(){
        this.userStore.user.first(user => user.id > 0)
        .do((user)=>{this.currentUser = user})
        .flatMap(user => Observable.forkJoin(this.albumService.getAlbumsForUser(user.id),this.albumService.getPublicAlbums()))
        .subscribe(res => {
                this.albums = res[0]
                this.publicAlbums = res[1]   
                this.publicAlbums = this.publicAlbums.filter((template)=> {return !this.albums.some(template2 => template.id == template2.id)})
                this.albums = this.albums.concat(this.publicAlbums)
                this.loading = false
            }
            ,error=>{
                this.error = error
                this.loading = false
            }
        )
    }

    openNewAlbumDialog(){
        let dialogRef = this.dialog.open(SaveAlbumModal, {
          height: 'auto',
          width: '30%',
        });
        dialogRef.afterClosed().subscribe(value => 
            {
                if(value){
                    let album = new Album
                    album.name = value.name
                    album.tagged = value.tagged
                    album.public = value.public
                    this.albumService.addAlbum(album).subscribe(album=>{
                         this.albums.push(album)
                    },error=>{
                        this.snackBar.open("Chyba při vytváření alba",null,{duration: 2500})
                    })
                }
            }
        )
    }  

    onDelete(album){

    }

    onEdit(album){
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
                         this.albums.splice(this.albums.indexOf(album),1,updatedAlbum)
                    },error=>{
                        this.snackBar.open("Chyba při aktualizaci alba",null,{duration: 2500})
                    })
                }
            }
        )
        dialogRef.componentInstance.setAlbum(album)
    }

    onSelected(album: Album){
       this.router.navigate(['albums',album.id])
    }
}