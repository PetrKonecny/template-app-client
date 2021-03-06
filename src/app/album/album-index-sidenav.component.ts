import { Component, OnInit, Input, ViewChild, Output, EventEmitter} from '@angular/core';
import { AlbumHttpService } from '../album/album-http.service'
import { Album} from '../album/album'
import { MdDialog } from '@angular/material'
import { AppComponentRef} from '../app.ref'
import { MdSnackBar } from '@angular/material';
import { ActivatedRoute} from '@angular/router';
import { UploadComponent } from '../uploader.component'
import { AppConfig } from '../app.config'
import { SaveAlbumModal } from '../album/save-album.modal'
import {UserStore} from '../user/user.store'
import { Observable }     from 'rxjs/Observable';
import {CreateTableModal} from '../element/create-table-element.modal' 
import { AlbumStore } from '../album/album.store'

@Component({
    selector: 'album-index-sidenav',
    template: `
        <div class="shutter">
          <md-spinner color="#f5f5f5" *ngIf="loading && !error"></md-spinner>
          <md-icon class="shutter" style="font-size: 96px; opacity: 0.1;" *ngIf="error">error</md-icon>
        </div>
        <md-toolbar class="sidenav-toolbar bg-dark text-light">
            <button *ngIf="selectedAlbum" md-icon-button (click)="onBackClicked($event)"><md-icon>arrow_back</md-icon></button>
            <h4 *ngIf="selectedAlbum">{{selectedAlbum.name ? selectedAlbum.name : 'nepojmenované album'}}</h4>
            <h4 *ngIf="!selectedAlbum">Alba</h4>
            <span style="flex: 1 1 auto"></span>
            <md-icon style="transform: scale(1.8,1.8); opacity:0.3; cursor: pointer;" (click)="onCloseClicked.emit(true)" mdTooltip="schovat boční panel">chevron_left</md-icon>    
        </md-toolbar>
        <div style="padding-left: 6px; padding-right: 6px; height: 100%; max-height: calc(100% - 64px)">
            <album-grid [showAddTile]="currentUser?.id > 0" *ngIf="albums && !selectedAlbum" (onAddAlbumClicked)="openNewAlbumDialog()" (onAlbumClicked)="onSelected($event)" [albums] = "albums" [cols]="3"></album-grid>
            <display-album-sidenav #albumDetail *ngIf="selectedAlbum" [album]="selectedAlbum"></display-album-sidenav>
        </div>
        `,
    styles:[`
        
    `]
})
//Displays albums in the side menu of the editor
export class AlbumIndexSidenavComponent implements OnInit  {
    
    //error thrown when loading albums
    error: string;
    //user albums to be displayed
    albums: Album[];
    //public albums to be displayed
    publicAlbums: Album[]
    //album that is selected
    selectedAlbum : Album;
    //loading status
    loading = true
    //currently logged in user
    currentUser

    //reference to the component containing images in the album
    @ViewChild('albumDetail')
    albumDetail

    @Output() 
    //trigered on delete clicked
    onCloseClicked = new EventEmitter<boolean>();
    
    sub
    /**
    @param userStore - store containing currently logged in user
    @param albumService - service used for loading albums
    */
    constructor(
        private albumStore: AlbumStore, private userStore: UserStore, private albumService: AlbumHttpService, public dialog: MdDialog, private snackBar: MdSnackBar, private route: ActivatedRoute,  private config: AppConfig
    ){ 
    }
    
    
    ngOnInit(){
        this.sub  = this.albumStore.content.subscribe(content => {
            this.loading = content.loading
            this.albums = content.albums
            this.error = content.error
        })
        this.userStore.user.first(user => user !== null).do(user => this.currentUser = user).flatMap(user => this.albumStore.getAlbums(user)).subscribe()
    }

    ngOnDestroy(){
        this.sub.unsubscribe()
    }

    //triggered when album selected
    onSelected(album: Album){
        this.selectedAlbum = album
    }

    openUploadModal() {
           
    }

    onDeleteClicked(){
    }

    //triggered when clicked back arrow
    onBackClicked(){
        this.selectedAlbum = null
    }

    //triggered when clicked add button
    onAddClicked(){
        if(this.selectedAlbum){
            this.openUploadDialog()
        }else{
            this.openNewAlbumDialog()
        }

    }

    //opens dialog to upload new images
    openUploadDialog() {
        let dialogRef = this.dialog.open(UploadComponent, {
          height: '90%',
          width: '60%',
        });
        dialogRef.componentInstance.uploadUrl = this.config.getConfig('api-url')+'/album/'+this.selectedAlbum.id +'/upload'
        dialogRef.componentInstance.onCompleteAll.subscribe(()=>
              this.albumDetail.getImages()
        )        
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
        dialogRef.componentInstance.title = "Vytvořit nové album"
        dialogRef.componentInstance.album = new Album        
    }
    
    //calls API to get public and user specific albums
    createNewTableElement(){
        let dialogRef = this.dialog.open(CreateTableModal, {height: 'auto',
          width: '30%',})
        dialogRef.afterClosed().subscribe(val =>{
            if(val && val.rows && val.columns && val.rowHeight && val.columnWidth){
             }     
        })
    }  
}