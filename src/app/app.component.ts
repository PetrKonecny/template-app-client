import { Component, OnInit, AfterViewChecked, HostListener  }       from '@angular/core';
import { TemplateInstanceService } from './template-instance/template-instance.service';
import { TemplateService } from './template/template.service';
import { TemplateInstanceStore } from './template-instance/template-instance.store';
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

@Component({
    selector: 'app-root',
    template: `
    <div style="height: 93%">
    <md-toolbar *ngIf="adminRoute" color="warn">
        <a md-button *ngIf="guard.canActivate()" routerLink="admin/users" routerLinkActive="active">USERS</a>
        <a md-button *ngIf="guard.canActivate()" routerLink="admin/templates" routerLinkActive="active">TEMPLATES</a>
        <a md-button *ngIf="guard.canActivate()" routerLink="admin/template-instances" routerLinkActive="active">DOCUMENTS</a>
        <a md-button *ngIf="guard.canActivate()" routerLink="admin/albums" routerLinkActive="active">IMAGES</a>
        <a md-button *ngIf="guard.canActivate()" routerLink="admin/pages" routerLinkActive="active">PAGES</a>
        <a md-button *ngIf="guard.canActivate()" routerLink="admin/contents" routerLinkActive="active">CONTENTS</a>
        <a md-button *ngIf="guard.canActivate()" routerLink="admin/elements" routerLinkActive="active">ELEMENTS</a>
        <a md-button *ngIf="guard.canActivate()"  routerLink="admin/fonts" routerLinkActive="active">FONTS</a>
    </md-toolbar>
    <md-toolbar *ngIf="!adminRoute" color="primary">
        <a md-button *ngIf="guard.canActivate()" routerLink="/templates" routerLinkActive="active">ŠABLONY</a>
        <a md-button *ngIf="guard.canActivate()" routerLink="/template-instances" routerLinkActive="active">DOKUMENTY</a>
        <a md-button *ngIf="guard.canActivate()" routerLink="/albums" routerLinkActive="active">OBRÁZKY</a>
        <a md-button *ngIf="!guard.canActivate()" href="{{config.getConfig('api-url')}}/user/login">PŘIHLÁSIT</a>
        <a md-button *ngIf="guard.canActivate()" href="{{config.getConfig('api-url')}}/user/logout">ODHLÁSIT</a>
    </md-toolbar>
    <router-outlet></router-outlet>
    </div>
    `,
    providers: [TemplateInstanceService,TemplateInstanceStore, TemplateStore, TemplateService,AppComponentRef ]
})

//root application module that displays navigation toolbar that is present on every page 
export class AppComponent implements OnInit {

    //whether route contains 'admin' 
    adminRoute = false;

    /**
    @param userStore - store containing user currently logged in
    @param userService - injects http service to communicate with API
    @param router - router service used for navigation in application
    @param fontStore- store containing available fonts
    @param config - application config
    @param route - currently active route
    */
    constructor(private userStore: UserStore, private userService: UserService, private router: Router, private fontStore: FontStore, private guard: UserGuard, private config: AppConfig, private route: ActivatedRoute,
    private ref: AppComponentRef){

    }

    /**triggered on mouse move in whole application
    other parts of application use this trigger if they want to react on moved mouse
    */ 
    @HostListener('document:mousemove', ['$event'])
    move($event){
        this.ref.nextMouseMove($event)        
    }

    /**triggered when the shift key is lifted
    other parts use this to ract on shift key action
    */
    @HostListener('document:keyup.shift', ['$event'])
    onShiftUp(){
        this.ref.nextShiftPress(false)
    }

    /**triggered when the shift key is pressed
    other parts use this to ract on shift key action
    */
    @HostListener('document:keydown.shift', ['$event'])
    onShiftDown(){
        this.ref.nextShiftPress(true)
    }

    //calls http service that logs out the user if logout button is clicked 
    onLogoutClicked(){
        this.userService.logoutUser().subscribe(()=>{this.userStore.loadUser(null)})
    }

    /**triggered when component is created
    gets authenticated user from api and avalilable fonts
    */
    ngOnInit(){
        this.router.events.subscribe(event=>{
            this.adminRoute = event.url.includes('admin')

        })
        this.userStore.auth().subscribe()
        this.fontStore.fonts.subscribe(fonts=>{
            fonts.forEach(font => {
                this.appendFontStyle(font)
            })
        })
    }

    //adds font styles to the html document, so that they can be displayed
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
