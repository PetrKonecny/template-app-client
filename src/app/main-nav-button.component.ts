import { Component, ViewEncapsulation }       from '@angular/core';
import {UserGuard} from './user/user.guard'
import {AppConfig} from './app.config'
import {UserStore} from './user/user.store'

@Component({
    selector: 'main-nav-button',
    template: `
    <button md-tooltip="navigace" md-icon-button [mdMenuTriggerFor]="navMenu"><md-icon>arrow_drop_down</md-icon></button>
    <md-menu #navMenu="mdMenu">
        <div class="main-nav-menu">
        <a md-menu-item routerLink="/about" routerLinkActive="active">O APLIKACI</a>
        <a md-menu-item *ngIf="!guard.canActivate()" routerLink="/demo" routerLinkActive="active">DEMO</a>
        <a md-menu-item *ngIf="guard.canActivate()" routerLink="/templates" routerLinkActive="active">ŠABLONY</a>
        <a md-menu-item *ngIf="guard.canActivate()" routerLink="/template-instances" routerLinkActive="active">DOKUMENTY</a>
        <a md-menu-item *ngIf="guard.canActivate()" routerLink="/albums" routerLinkActive="active">ALBA</a>
        <a md-menu-item *ngIf="guard.canActivate()" [routerLink]="['/users', (store.user | async)?.id]" routerLinkActive="active">PROFIL</a>
        <a md-menu-item *ngIf="!guard.canActivate()" href="{{config.getConfig('api-url')}}/user/login">PŘIHLÁSIT</a>
        <a md-menu-item *ngIf="guard.canActivate()" href="{{config.getConfig('api-url')}}/user/logout">ODHLÁSIT</a>
        </div>
    </md-menu>   
    `,
    encapsulation: ViewEncapsulation.None,
    styles: [`

    `]
})

//root application module that displays navigation toolbar that is present on every page 
export class MainNavButtonComponent {


    constructor(public guard: UserGuard, public config: AppConfig, public store: UserStore){}
  
}
