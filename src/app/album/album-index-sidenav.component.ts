import { Component, OnInit, Input, ViewChild} from '@angular/core';
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

@Component({
    selector: 'album-index-sidenav',
    template: `
        <div class="shutter">
          <md-spinner *ngIf="loading && !error"></md-spinner>
          <md-icon class="shutter" style="font-size: 96px; opacity: 0.1;" *ngIf="error">error</md-icon>
        </div>
        <md-toolbar>
            <button *ngIf="selectedAlbum" md-icon-button (click)="onBackClicked($event)"><md-icon>arrow_back</md-icon></button>
            <h4 *ngIf="selectedAlbum">{{selectedAlbum.name ? selectedAlbum.name : 'nepojmenované album'}}</h4>
            <h4 *ngIf="!selectedAlbum">Všechna alba</h4>
            <span style="flex: 1 1 auto"></span>´
            <button *ngIf="!selectedAlbum" md-icon-button (click)="onAddClicked()" mdTooltip="přidat album"><md-icon>add</md-icon></button>
            <button *ngIf="selectedAlbum" md-icon-button (click)="onAddClicked()" mdTooltip="nahrát obrázky do alba"><md-icon>add</md-icon></button>
        </md-toolbar>
        <album-list *ngIf="!selectedAlbum && albums" (onAlbumClicked)="onSelected($event)" [albums] = "albums" [cols]="3"></album-list>
        <display-album-sidenav #albumDetail *ngIf="selectedAlbum" [album]="selectedAlbum"></display-album-sidenav>
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

    /**
    @param userStore - store containing currently logged in user
    @param albumService - service used for loading albums
    */
    constructor(
        private userStore: UserStore, private albumService: AlbumHttpService, public dialog: MdDialog, private snackBar: MdSnackBar, private route: ActivatedRoute,  private config: AppConfig
    ){ 
    }
    
    
    ngOnInit(){
        this.getAlbums()
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
                if(value == 'save'){
                    this.albumService.addAlbum(dialogRef.componentInstance.album).subscribe(album=>{
                         this.albums.push(album)
                    },error=>{
                        this.snackBar.open("Chyba při vytváření alba",null,{duration: 2500})
                    })
                }
            }
        )
        dialogRef.componentInstance.album = new Album        
    }
    
    //calls API to get public and user specific albums
    getAlbums(){
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
}