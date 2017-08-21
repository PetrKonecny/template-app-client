import { Component, OnInit, ViewChild} from '@angular/core';
import { AlbumHttpService } from '../album/album-http.service'
import { Album} from '../album/album'
import { MdDialog } from '@angular/material'
import  { AppComponentRef } from '../app.ref'
import { Router } from '@angular/router'
import { MdSnackBar } from '@angular/material';
import { SaveAlbumModal } from '../album/save-album.modal'
import {UserStore} from '../user/user.store'
import { Observable }     from 'rxjs/Observable';
import {AlbumHelper} from '../album/album.helper'

@Component({
    selector: 'album-index',
    template: `
        <div class="shutter">
          <md-spinner *ngIf="loading && !error"></md-spinner>
          <md-icon class="shutter" style="font-size: 96px; opacity: 0.1;" *ngIf="error">error</md-icon>
        </div>
        <md-toolbar style="position: fixed; z-index: 5;">
                <button md-button *ngIf="showOpenButton()" [routerLink] = "['/albums', selected[0].id]">OTEVŘÍT ALBUM</button>
                <button md-button *ngIf="showEditButton()" (click)="onEditClicked(selected[0])">UPRAVIT ALBUM</button>
                <button md-button *ngIf="showDeleteButton()" (click)="onDeleteClicked(selected[0])">SMAZAT ALBUM</button>
        </md-toolbar>
        <div class ="index-content">
            <ngx-datatable #table style="padding-top: 64px;" *ngIf="currentUser && albums?.length"
                     class="material"
                    [columnMode]="'force'"
                    [headerHeight]="50"
                    [footerHeight]="0"
                    [rowHeight]="'auto'"
                    [selected]="selected"
                    [selectionType]="'single'"
                    [rows]="albums"
                >
                <ngx-datatable-column prop="name" name="název">
                </ngx-datatable-column>
                <ngx-datatable-column prop="tagged" name="tagy">
                    <ng-template  let-value="value" ngx-datatable-cell-template>
                    <md-chip-list>
                    <md-chip *ngFor="let tag of value">{{tag.tag_name}}</md-chip>
                    </md-chip-list>
                    </ng-template>
                </ngx-datatable-column>
                <ngx-datatable-column prop="updated_at" name="naposledy upraveno">
                    <ng-template  let-value="value" ngx-datatable-cell-template>
                    {{value | date : 'short'}}
                    </ng-template>
                </ngx-datatable-column>
            </ngx-datatable>
        </div>
        <button md-fab class="index-button" (click)="openNewAlbumDialog()"><md-icon>add</md-icon></button>
    `,
    styles:[`
        
    `]
})

//displays index page for albums
export class AlbumIndexComponent implements OnInit  {


    @ViewChild('table')
    table: any    
    //error thrown while loading albums
    error: string;
    //user albums to be displayed
    albums : Album[];
    //public albums to be displayed
    publicAlbums: Album[]
    //loading indicator
    loading = true

    selected: Album[] = []
    //user currently logged in
    currentUser

    /**
    @param userStore - user store containing currently logged in user
    @param albumService - service to call API to get albums
    @param dialog - dialog service to display dialogs
    @param router -router service used to navigate in app
    @param snackBar - snackbar to display errors on
    */
    constructor(
        private userStore: UserStore, private albumService: AlbumHttpService, public dialog: MdDialog, private router: Router, private snackBar: MdSnackBar
    ){ 
    }
    
    //loads albums for user and all public albums
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

    showOpenButton(){
        return this.selected.length
    }

    showEditButton(){
        return this.selected.length && AlbumHelper.canEditAlbum(this.currentUser, this.selected[0])
    }

    showDeleteButton(){
        return this.selected.length && AlbumHelper.canEditAlbum(this.currentUser, this.selected[0])
    }

    //opens dialog to create new album
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

    onDeleteClicked(album){
        this.albumService.removeAlbum(album.id).subscribe(()=>{
            this.albums.splice(this.albums.indexOf(album),1)
        },error =>{                        
            this.snackBar.open("Chyba při mazání alba",null,{duration: 2500})})
    }

    //opens dialog to edit ablum
    onEditClicked(album){
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
                         this.albums.splice(this.albums.indexOf(album),1, updatedAlbum)
                         let albums = [...this.albums]
                         this.albums = albums
                    },error=>{
                        this.snackBar.open("Chyba při aktualizaci alba",null,{duration: 2500})
                    })
                }
            }
        )
        dialogRef.componentInstance.setAlbum(album)
    }

    //triggered on album clicked
}