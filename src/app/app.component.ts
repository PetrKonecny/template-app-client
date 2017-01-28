import { Component, OnInit }       from '@angular/core';
import { TemplateInstanceService } from './template-instance/template-instance.service';
import { TemplateService } from './template/template.service';
import { TemplateInstanceStore } from './template-instance/template-instance.store';
import { Draggable} from './draggable.directive'
import {UserStore} from './user/user.store'
import {UserService} from './user/user.service'
import {Router} from '@angular/router'
import {FontStore} from './font/font.store'
import {Font} from './font/font'

@Component({
    selector: 'app-root',
    template: `
    <md-toolbar color="primary"><h1>{{title}}</h1>
        <a md-button *ngIf="userStore.loggedIn()" routerLink="/templates" routerLinkActive="active">TEMPLATES</a>
        <a md-button *ngIf="userStore.loggedIn()" routerLink="/template-instances" routerLinkActive="active">YOUR DOCUMENTS</a>
        <a md-button *ngIf="userStore.loggedIn()" routerLink="/images" routerLinkActive="active">IMAGES</a>
        <a md-button *ngIf="userStore.loggedIn()"  routerLink="/fonts" routerLinkActive="active">FONTS</a>
        <a md-button *ngIf="!userStore.loggedIn()" routerLink="/login" routerLinkActive="active">LOGIN</a>
        <a md-button *ngIf="userStore.loggedIn()" (click)="onLogoutClicked()">Logout</a>
    </md-toolbar>
        <router-outlet></router-outlet>
    `,
    providers: [
        TemplateInstanceService,TemplateInstanceStore,TemplateService,Draggable ]
})

export class AppComponent implements OnInit {
    title = 'Template App';

    constructor(private userStore: UserStore, private userService: UserService, private router: Router, private fontStore: FontStore){}

    onLogoutClicked(){
        this.userService.logoutUser()
        this.router.navigate(['/login'])
    }

    ngOnInit(){
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
                src: url('"+"http://localhost:8080/font/"+font.id +"/file" +"');\
            }\
            "));
        document.head.appendChild(newStyle);
    }
}
