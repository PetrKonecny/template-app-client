import { Component }       from '@angular/core';
import {UserGuard} from './user/user.guard'
import {AppConfig} from './app.config'
import {UserStore} from './user/user.store'

@Component({
    selector: 'main-toolbar',
    template: `
    <md-toolbar class="main-toolbar" color="primary" class="mat-elevation-z6 main-toolbar">
        <a md-button routerLink="/about" routerLinkActive="active">O APLIKACI</a>
        <a md-button *ngIf="!guard.canActivate()" routerLink="/demo" routerLinkActive="active">DEMO</a>
        <a md-button *ngIf="guard.canActivate()" routerLink="/templates" routerLinkActive="active">ŠABLONY</a>
        <a md-button *ngIf="guard.canActivate()" routerLink="/template-instances" routerLinkActive="active">DOKUMENTY</a>
        <a md-button *ngIf="guard.canActivate()" routerLink="/albums" routerLinkActive="active">ALBA</a>
        <a md-button *ngIf="guard.canActivate()" [routerLink]="['/users', (store.user | async)?.id]" routerLinkActive="active">PROFIL</a>
        <a md-button *ngIf="!guard.canActivate()" href="{{config.getConfig('api-url')}}/user/login">PŘIHLÁSIT</a>
        <a md-button *ngIf="guard.canActivate()" href="{{config.getConfig('api-url')}}/user/logout">ODHLÁSIT</a>
    </md-toolbar>
    `,
})

//root application module that displays navigation toolbar that is present on every page 
export class MainToolbarComponent {


    constructor(public guard: UserGuard, public config: AppConfig, public store: UserStore){}
  
}
