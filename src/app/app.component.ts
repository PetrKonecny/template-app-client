import { Component, OnInit, AfterViewChecked  }       from '@angular/core';
import { TemplateInstanceService } from './template-instance/template-instance.service';
import { TemplateService } from './template/template.service';
import { TemplateInstanceStore } from './template-instance/template-instance.store';
import { Draggable} from './draggable.directive'
import {UserStore} from './user/user.store'
import {UserService} from './user/user.service'
import {Router} from '@angular/router'
import {FontStore} from './font/font.store'
import {Font} from './font/font'
import {UserGuard} from './user/user.guard'
import {AppConfig} from './app.config'
import {ActivatedRoute} from '@angular/router';
import {Location } from '@angular/common';
import {AppComponentRef} from './app.ref'
import { TemplateStore } from './template/template.store'

/**
*@description 
* root app component 
**/
@Component({
    selector: 'app-root',
    template: `
    <span (mousemove)="test($event)" (document:keyup.shift)="onShiftUp()" (document:keydown.shift)="onShiftDown()" style="height: 95%">
    <md-toolbar *ngIf="adminRoute" color="warn">
        <a md-button *ngIf="guard.canActivate()" routerLink="admin/users" routerLinkActive="active">USERS</a>
        <a md-button *ngIf="guard.canActivate()" routerLink="admin/templates" routerLinkActive="active">TEMPLATES</a>
        <a md-button *ngIf="guard.canActivate()" routerLink="admin/template-instances" routerLinkActive="active">DOCUMENTS</a>
        <a md-button *ngIf="guard.canActivate()" routerLink="admin" routerLinkActive="active">IMAGES</a>
        <a md-button *ngIf="guard.canActivate()" routerLink="admin" routerLinkActive="active">PAGES</a>
        <a md-button *ngIf="guard.canActivate()" routerLink="admin" routerLinkActive="active">CONTENTS</a>
        <a md-button *ngIf="guard.canActivate()" routerLink="admin" routerLinkActive="active">ELEMENTS</a>
        <a md-button *ngIf="guard.canActivate()"  routerLink="admin" routerLinkActive="active">FONTS</a>
        <a md-button *ngIf="guard.canActivate()" routerLink="/" routerLinkActive="active">APP</a>
    </md-toolbar>
    <md-toolbar *ngIf="!adminRoute" color="primary">
        <a md-button *ngIf="guard.canActivate()" routerLink="/templates" routerLinkActive="active">TEMPLATES</a>
        <a md-button *ngIf="guard.canActivate()" routerLink="/template-instances" routerLinkActive="active">YOUR DOCUMENTS</a>
        <a md-button *ngIf="guard.canActivate()" routerLink="/images" routerLinkActive="active">IMAGES</a>
        <a md-button *ngIf="guard.canActivate()"  routerLink="/fonts" routerLinkActive="active">FONTS</a>
        <a md-button *ngIf="!guard.canActivate()" routerLink="/login" routerLinkActive="active">LOGIN</a>
        <a md-button *ngIf="guard.canActivate()" routerLink="/admin" routerLinkActive="active">ADMIN</a>
        <a md-button *ngIf="guard.canActivate()" (click)="onLogoutClicked()">Logout</a>
    </md-toolbar>
        <router-outlet></router-outlet>
    <span>
    `,
    providers: [TemplateInstanceService,TemplateInstanceStore, TemplateStore, TemplateService,Draggable,AppComponentRef ]
})

export class AppComponent implements OnInit, AfterViewChecked {

    adminRoute = false;

    constructor(private userStore: UserStore, private userService: UserService, private router: Router, private fontStore: FontStore, private guard: UserGuard, private config: AppConfig, private route: ActivatedRoute,
    private ref: AppComponentRef){

    }

    test($event){
        this.ref.nextMouseMove($event)        
    }

    onShiftUp(){
        this.ref.nextShiftPress(false)
    }

    onShiftDown(){
        this.ref.nextShiftPress(true)
    }

    ngAfterViewChecked(){
    }

    onLogoutClicked(){
        this.userService.logoutUser()
        this.router.navigate(['/login'])
    }

    ngOnInit(){
        this.router.events.subscribe(event=>{
            this.adminRoute = event.url.includes('admin')

        })
        this.fontStore.fonts.subscribe(fonts=>{
            fonts.forEach(font => {
                this.appendFontStyle(font)
            })
        })
    }

    //make this work through framework somehow
    appendFontStyle(font: Font){
        var newStyle = document.createElement('style');
            newStyle.appendChild(document.createTextNode("\
            @font-face {\
                font-family: '" +"font" + font.id + "';\
                src: url('"+this.config.getConfig('api-url')+"/font/"+font.id +"/file" +"');\
            }\
            "));
        document.head.appendChild(newStyle);
    }
}
