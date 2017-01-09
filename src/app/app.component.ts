import { Component }       from '@angular/core';
import { TemplateInstanceService } from './template-instance/template-instance.service';
import { TemplateService } from './template/template.service';
import { TemplateInstanceStore } from './template-instance/template-instance.store';
import { Draggable} from './draggable.directive'
import {UserStore} from './user/user.store'
import {UserService} from './user/user.service'
import {Router} from '@angular/router'

@Component({
    selector: 'app-root',
    template: `
    <h1>{{title}}</h1>
        <a *ngIf="userStore.loggedIn()" routerLink="/templates" routerLinkActive="active">Templates</a>
        <a *ngIf="userStore.loggedIn()" routerLink="/template-instances" routerLinkActive="active">Template Instances</a>
        <a *ngIf="userStore.loggedIn()" routerLink="/images" routerLinkActive="active">Images</a>
        <a *ngIf="userStore.loggedIn()"  routerLink="/fonts" routerLinkActive="active">Fonts</a>
        <a *ngIf="!userStore.loggedIn()" routerLink="/login" routerLinkActive="active">Login</a>
        <a *ngIf="userStore.loggedIn()" (click)="onLogoutClicked()">Logout</a>
        <router-outlet></router-outlet>
    `,
    providers: [
        TemplateInstanceService,TemplateInstanceStore,TemplateService,Draggable ]
})

export class AppComponent {
    title = 'Template App';

    constructor(private userStore: UserStore, private userService: UserService, private router: Router){}

    onLogoutClicked(){
        this.userService.logoutUser()
        this.router.navigate(['/login'])
    }
}
