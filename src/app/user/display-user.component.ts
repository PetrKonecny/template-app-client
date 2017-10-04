import { Component, OnInit} from '@angular/core';
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
        <div class="content" style="height: 100%;">
        <md-tab-group style="height: 100%; margin: 0 16px; background: white;">
            <md-tab label="šablony">
                <template-list [user]="userStore.user | async" [templates]="templates"></template-list>
            </md-tab>
            <md-tab *ngIf="(userStore.user | async)?.id  == user?.id" label="dokumenty">
                <template-instance-list [templateInstances]="documents"></template-instance-list>
            </md-tab>
            <md-tab label="alba">
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

    documents
    templates
    albums

    constructor(
        private albumStore: AlbumStore, private albumService: AlbumHttpService, private templateService: TemplateService, private templateInstanceService: TemplateInstanceService, private userStore: UserStore, private userService: UserService, private route: ActivatedRoute, private snackBar: MdSnackBar  
    ){ 
    }

    ngOnInit(){
        this.route.params
        .flatMap((params)=>this.userService.getUser(params['id']))
        .do(user => this.user = user)
        .flatMap(user => Observable.forkJoin(this.templateInstanceService.getTemplateInstancesForUser(user.id),
                                             this.templateService.getTemplatesForUserByType(user.id,'no_instance_template'),
                                             this.templateService.getTemplatesForUser(user.id),
                                             this.albumStore.getForUser(user)))
        .first()
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