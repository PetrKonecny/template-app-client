import { Component, OnInit} from '@angular/core';
import {UserListComponent} from './user-list.component';
import { UserService } from './user.service';
import { User} from '../user/user';
import { Observable }     from 'rxjs/Observable';
import { ActivatedRoute} from '@angular/router';
import { MdSnackBar } from '@angular/material';
import {UserStore} from '../user/user.store'

@Component({
    selector: 'display-user',
    template: `
        <div class="shutter">
          <md-spinner *ngIf="loading && !error"></md-spinner>
          <md-icon class="shutter" style="font-size: 96px; opacity: 0.1;" *ngIf="error">error</md-icon>
        </div>
        <div class="wrapper">
        <div class="side">
        <div class="profile-pic"></div>
        <h1 class="name">{{user?.name ? user.name : 'Uživatelské jméno'}}</h1>
        </div>
        <md-tab-group class="main">
            <md-tab label="šablony">
                <template-list [user]="currentUser" [templates]="user?.templates"></template-list>
            </md-tab>
            <md-tab *ngIf="currentUser?.id  == user?.id" label="dokumenty">
                <template-instance-list [templateInstances]="user?.template_instances"></template-instance-list>
            </md-tab>
            <md-tab label="alba">
                <album-list [albums]="user?.albums" [grid]="false"></album-list>
            </md-tab>
        </md-tab-group>
        </div>
    `,
    providers: [],
    styles: [`
        .profile-pic{
            width: 10%;
            padding-top: 10%;
            background: white;
            border-radius: 50%;
        }
        .name{
            padding-left: 16px;
        }
        .wrapper{
            height: 100%;
            display: flex;
            flex-direction: column;
        }
        .side{
            display: flex;
            padding: 16px;
            align-items: center;
            flex-direction: row;
        }
        .main{
        }

    `]
})

export class DisplayUserComponent implements OnInit{
    
    user : User

    loading = true

    error: string

    currentUser: User

    constructor(
        private userStore: UserStore, private userService: UserService, private route: ActivatedRoute, private snackBar: MdSnackBar  
    ){ 
        userStore.user.subscribe(user => this.currentUser = user)
    }

    ngOnInit(){
        this.getUser()
    }

    getUser(){
       this.route.params
        .flatMap((params)=>this.userService.getUser(params['id']))
        .first()
        .subscribe(
            user=> {
                this.user = user
                this.loading = false
            },
            error=> {
                this.error = error
                this.snackBar.open("Chyba při načítání uživatele",null,{duration: 1500})
            }
        )
    }
}