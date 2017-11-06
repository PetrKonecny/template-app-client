import { Component, OnInit, AfterViewChecked, HostListener  }       from '@angular/core';
import { TemplateInstanceService } from '../../src/app/template-instance/template-instance.service';
import { TemplateService } from '../../src/app/template/template.service';
import { TemplateInstanceStore } from '../../src/app/template-instance/template-instance.store';
import {UserStore} from '../../src/app/user/user.store'
import {UserService} from '../../src/app/user/user.service'
import {Router} from '@angular/router'
import {FontStore} from '../../src/app/font/font.store'
import {Font} from '../../src/app/font/font'
import {UserGuard} from '../../src/app/user/user.guard'
import {AppConfig} from '../../src/app/app.config'
import {ActivatedRoute,NavigationEnd} from '@angular/router';
import {Location } from '@angular/common';
import { TemplateStore } from '../../src/app/template/template.store'
import { User} from '../../src/app/user/user'
import { AlbumStore } from '../../src/app/album/album.store'
@Component({
    selector: 'app-root',
    template: `
    <div class="app-root" style="height: 100%;">
    <md-sidenav-container style="height: 100%;">
    <md-sidenav style="padding-left: 6px;" #sidenav mode="side" opened="true" color="warn" class="mat-elevation-z2 main-toolbar">
        <md-nav-list>
        <a mat-list-item *ngIf="guard.canActivate()" routerLink="admin/dash" routerLinkActive="active">DASHBOARD</a>
        <h3 matSubheader>Models</h3>
        <a mat-list-item *ngIf="guard.canActivate()" routerLink="admin/users" routerLinkActive="active">USERS</a>
        <a mat-list-item *ngIf="guard.canActivate()" routerLink="admin/templates" routerLinkActive="active">TEMPLATES</a>
        <a mat-list-item *ngIf="guard.canActivate()" routerLink="admin/template-instances" routerLinkActive="active">DOCUMENTS</a>
        <a mat-list-item *ngIf="guard.canActivate()" routerLink="admin/albums" routerLinkActive="active">IMAGES</a>
        <a mat-list-item *ngIf="guard.canActivate()" routerLink="admin/pages" routerLinkActive="active">PAGES</a>
        <a mat-list-item *ngIf="guard.canActivate()" routerLink="admin/contents" routerLinkActive="active">CONTENTS</a>
        <a mat-list-item *ngIf="guard.canActivate()" routerLink="admin/elements" routerLinkActive="active">ELEMENTS</a>
        <a mat-list-item *ngIf="guard.canActivate()" routerLink="admin/fonts" routerLinkActive="active">FONTS</a>
        </md-nav-list>
    </md-sidenav>
    <router-outlet></router-outlet>
    </md-sidenav-container>
    </div>
    `,
})

//root application module that displays navigation toolbar that is present on every page 
export class AppComponent implements OnInit {

    //whether route contains 'admin' 
    currentUser: User;

    /**
    @param userStore - store containing user currently logged in
    @param userService - injects http service to communicate with API
    @param router - router service used for navigation in application
    @param fontStore- store containing available fonts
    @param config - application config
    @param route - currently active route
    */
    constructor(private albumStore: AlbumStore, private userStore: UserStore, private userService: UserService, private router: Router, private fontStore: FontStore, public guard: UserGuard, private config: AppConfig, private route: ActivatedRoute){
        this.userStore.user.subscribe(user=>this.currentUser = user)
    }

    //calls http service that logs out the user if logout button is clicked 
    onLogoutClicked(){
        this.userService.logoutUser().subscribe(()=>{this.userStore.loadUser(null)})
    }

    /**triggered when component is created
    gets authenticated user from api and avalilable fonts
    */
    ngOnInit(){       
        this.userStore.auth().subscribe()
        this.userStore.user.first(user => (user && user.id > 0)).subscribe(user =>{
        })
        this.fontStore.fonts.subscribe()
    }
}
