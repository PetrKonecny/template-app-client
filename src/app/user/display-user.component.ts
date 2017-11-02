import { Component, OnInit, Input} from '@angular/core';
import {UserListComponent} from './user-list.component';
import { UserService } from './user.service';
import { User} from '../user/user';
import { Observable }     from 'rxjs/Observable';
import { ActivatedRoute} from '@angular/router';
import { MdSnackBar } from '@angular/material';
import { UserStore } from '../user/user.store'
import { TemplateService } from '../template/template.service';
import { TemplateInstanceService } from '../template-instance/template-instance.service';
import { AlbumHttpService } from '../album/album-http.service'
import { AlbumStore } from '../album/album.store'

@Component({
    selector: 'display-user',
    template: `
        <div class="shutter">
          <md-spinner *ngIf="loading && !error"></md-spinner>
          <md-icon class="shutter" style="font-size: 96px; opacity: 0.1;" *ngIf="error">error</md-icon>
        </div>
        <div class="wrapper">
        <div class="header">
        <div class="profile-pic"><div>{{user?.name.charAt(0)}}</div></div>
        <h1 class="name">{{user?.name ? user.name : 'Uživatelské jméno'}}</h1>
        </div>
        <div class="content" style="height: 100%;" *ngIf="albums?.length || documents?.length || templates?.length">
        <md-tab-group style="height: 100%; margin: 0 16px; background: white;">
            <md-tab label="šablony ({{templates.length}})" *ngIf="templates?.length">
                <template-list [user]="userStore.user | async" [templates]="templates"></template-list>
            </md-tab>
            <md-tab *ngIf="documents?.length && (userStore.user | async)?.id  == user?.id" label="dokumenty ({{documents.length}})">
                <template-instance-list [templateInstances]="documents"></template-instance-list>
            </md-tab>
            <md-tab label="alba ({{albums.length}})" *ngIf="albums?.length">
                <album-list [user]="user" [albums]="(albumStore.content | async).albums"></album-list>
            </md-tab>
        </md-tab-group>
        </div>
        </div>
    `,
    providers: [AlbumStore],
    styles: [`
        .name{
            padding-left: 16px;
        }
        .wrapper{
            height: 100%;
        }
        .header{
            padding: 16px;
            display: flex;
            align-items: center;
            flex-direction: row;
        }

    `]
})

export class DisplayUserComponent implements OnInit{
    
    user : User

    loading = true

    error: string

    @Input()
    id: number

    documents
    templates
    albums

    constructor(
        public albumStore: AlbumStore, public albumService: AlbumHttpService, private templateService: TemplateService, private templateInstanceService: TemplateInstanceService, public userStore: UserStore, private userService: UserService, private route: ActivatedRoute, private snackBar: MdSnackBar  
    ){ 
    }

    ngOnInit(){
        this.route.params
        .do(params =>{if(params['id']){this.id = params['id']}})
        .flatMap((params)=>this.userService.getUser(this.id))
        .do(user => this.user = user)
        .flatMap(user => Observable.forkJoin(this.userService.getUserTemplateInstances(user.id).map((instances)=>instances,(intances)=>[]),
                                             this.userService.getUserTemplatesByType(user.id,'no_instance_template'),
                                             this.userService.getUserTemplates(user.id),
                                             this.albumStore.getForUser(user)))
        .subscribe(
            res=> {
                this.templates = res[2]
                this.documents = res[1].concat(res[0])
                this.albums = res[3]
                this.loading = false
            },
            error=> {
                this.error = error
                this.snackBar.open("Chyba při načítání uživatele",null,{duration: 1500})
            }
        )
    }
}