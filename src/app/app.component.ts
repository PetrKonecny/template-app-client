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
import {ActivatedRoute,NavigationEnd} from '@angular/router';
import {Location } from '@angular/common';
import {AppComponentRef} from './app.ref'
import { TemplateStore } from './template/template.store'
import { User} from './user/user'
import { AlbumStore } from './album/album.store'
@Component({
    selector: 'app-root',
    template: `
    <div class="app-root" style="height: 100%;">
    <md-toolbar color="primary" class="mat-elevation-z6 main-toolbar">
        <a md-button routerLink="/about" routerLinkActive="active">O APLIKACI</a>
        <a md-button *ngIf="!guard.canActivate()" routerLink="/demo" routerLinkActive="active">DEMO</a>
        <a md-button *ngIf="guard.canActivate()" routerLink="/templates" routerLinkActive="active">ŠABLONY</a>
        <a md-button *ngIf="guard.canActivate()" routerLink="/template-instances" routerLinkActive="active">DOKUMENTY</a>
        <a md-button *ngIf="guard.canActivate()" routerLink="/albums" routerLinkActive="active">ALBA</a>
        <a md-button *ngIf="guard.canActivate()" [routerLink]="['/users', currentUser?.id]" routerLinkActive="active">PROFIL</a>
        <a md-button *ngIf="!guard.canActivate()" href="{{config.getConfig('api-url')}}/user/login">PŘIHLÁSIT</a>
        <a md-button *ngIf="guard.canActivate()" href="{{config.getConfig('api-url')}}/user/logout">ODHLÁSIT</a>
    </md-toolbar>
    <router-outlet></router-outlet>
    </div>
    `,
    providers: [AppComponentRef]
})

//root application module that displays navigation toolbar that is present on every page 
export class AppComponent implements OnInit {

    //whether route contains 'admin' 
    adminRoute = false;
    currentUser: User;

    /**
    @param userStore - store containing user currently logged in
    @param userService - injects http service to communicate with API
    @param router - router service used for navigation in application
    @param fontStore- store containing available fonts
    @param config - application config
    @param route - currently active route
    */
    constructor(private albumStore: AlbumStore, private userStore: UserStore, private userService: UserService, private router: Router, private fontStore: FontStore, private guard: UserGuard, private config: AppConfig, private route: ActivatedRoute,
    private ref: AppComponentRef){
        this.userStore.user.subscribe(user=>this.currentUser = user)
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

    @HostListener('document:keyup.control', ['$event'])
    onCtrlUp(){
        this.ref.nextCtrlPress(false)
    }

    /**triggered when the shift key is pressed
    other parts use this to ract on shift key action
    */
    @HostListener('document:keydown.control', ['$event'])
    onCtrilDown(){
        this.ref.nextCtrlPress(true)
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
