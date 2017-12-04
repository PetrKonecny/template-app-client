import { Component, OnInit} from '@angular/core';
import {TemplateListComponent} from './template-list.component';
import { TemplateService } from './template.service';
import { Template, TemplatesState} from './template';
import { Observable }     from 'rxjs/Observable';
import { Router } from '@angular/router'
import {MdDialog, MdDialogRef} from '@angular/material'
import {CreateTemplateModal} from './create-template.modal'
import {Page} from '../page/page'
import {UserStore} from '../user/user.store'
import {User, selectCurrentUser} from '../user/user'
import {TemplateHelper} from '../template/template.helper'
import {DisplayUserComponent} from '../user/display-user.component'
import { UserService } from '../user/user.service';
import { AppConfig }from '../app.config'
import { Store } from "@ngrx/store";
import { AppState } from '../app.state'

@Component({
    selector: 'template-index',
    template: `
        <main-toolbar></main-toolbar>
        <md-toolbar>
            <form class="search-field" (ngSubmit)="onSearchKeyUp(search.value)">
                <md-input-container><input  #search mdInput type="search"></md-input-container>
                <button md-icon-button><md-icon>search</md-icon></button>
            </form>
                <button md-button *ngIf="showCreateButton()" [routerLink] = "['/templates', selected[0].id, 'instance']">NOVÝ DOKUMENT</button>
                <button md-button *ngIf="showEditButton()" [routerLink] = "['/templates', selected[0].id, 'edit']">UPRAVIT ŠABLONU</button>
                <button md-button *ngIf="showDeleteButton()" (click)="onDeleteClicked(selected[0])">SMAZAT ŠABLONU</button>
                <a md-button *ngIf="showCreateButton()" href={{getPdfLink()}} target="_blank">PDF</a>
        </md-toolbar>
        <md-progress-bar *ngIf="loading" mode="indeterminate" ></md-progress-bar>
        <div class="shutter" *ngIf="error">
                <md-icon style="font-size: 96px; opacity: 0.1;">error</md-icon>
        </div>
        <div class ="index-content">
            <ngx-datatable
                 class="material"
                [columnMode]="'force'"
                [headerHeight]="50"
                [footerHeight]="0"
                [rowHeight]="'auto'"
                [selected]="selected"
                [selectionType]="'single'"
                [rows]="allTemplates"
            >
            <ngx-datatable-column prop="name" name="název">
            </ngx-datatable-column>
            <ngx-datatable-column prop="tagged" name="tagy">
                <ng-template  let-value="value" ngx-datatable-cell-template>
                <md-chip-list>
                <md-chip *ngFor="let tagId of value">{{allTags[tagId].tag_name}}</md-chip>
                </md-chip-list>
                </ng-template>
            </ngx-datatable-column>
            <ngx-datatable-column prop="updated_at" name="naposledy upraveno">
                <ng-template  let-value="value" ngx-datatable-cell-template>
                {{value | date : 'short'}}
                </ng-template>
            </ngx-datatable-column>
            <ngx-datatable-column prop="user" name="uživatel">
                <ng-template  let-value="value" ngx-datatable-cell-template>
                <a [routerLink]="['/users', value]">{{allUsers[value].name ? allUsers[value].name : value}}</a>
                </ng-template>
            </ngx-datatable-column>
            </ngx-datatable>
        </div>
        <button md-fab class="index-button" (click)="onAddTemplateClicked()"><md-icon>add</md-icon></button>
    `,
    providers: []
})

export class TemplateIndexComponent implements OnInit  {
    
    //error message from http calls
    error: string
    //array of users templates
    allTemplates : any
    allTags: any
    allUsers: any

    tmp: any
    //array of templates everyone can see 
    publicTemplates : Template[]
    loading = true
    //user currently using the app
    currentUser : User

    selected: Template[] = [] 

    subs = []
    /**
    @param 'templateService' - injects template service to make http calls to API
    @param 'router'- injects router to enable navigation from class
    @param 'dialog' - injects dialog to enable displaying dialogs
    @param 'userStore' - injects to get current user for displaying appropriate controlls
    (ex, if user can't edit template edit button is not present)
    */
    constructor(
        public store: Store<AppState>, private userService: UserService, private templateService: TemplateService, private router: Router, public dialog: MdDialog, private userStore: UserStore , public config: AppConfig
    ){ 
    }

    showEditButton(){
        return this.selected.length && TemplateHelper.canEditTemplate(this.currentUser, this.selected[0])
    }

    showDeleteButton(){
        return this.selected.length && TemplateHelper.canDeleteTemplate(this.currentUser, this.selected[0])
    }

    showCreateButton(){
        return this.selected.length && TemplateHelper.canCreateDocumentFromTemplate(this.currentUser, this.selected[0])
    }

    getPdfLink(){
        return this.config.getConfig('api-url')+'/template/'+this.selected[0].id+'/pdf' 
    }

    columns = [
        { prop: 'name', name: 'název'},
        { prop: 'tagged', name: 'tagy'},
        { prop: 'updated_at', name: 'naposledy upraveno'},
        { prop: 'user', name: 'uživatel'}
    ]
    
    /*
    Called after component is initiated
    */
    ngOnInit(){
        this.subs.push(this.store.select('templates').subscribe(data=>this.allTemplates = data.templates && (<any>Object).values(data.templates)))
        this.subs.push(this.store.select('tags').subscribe(data=>this.allTags = data.tags))
        this.subs.push(this.store.select('users').subscribe(data=>this.allUsers = data.users))
        this.subs.push(this.store.select(selectCurrentUser).subscribe(data=>this.currentUser = data))
        this.store.select('user').first(userState => userState.user && userState.user > 0)
        .subscribe(()=>this.store.dispatch({type: "REQUEST_TEMPLATES"})) 
    }

    ngOnDestroy(){
        this.subs.forEach(sub => sub.complete())
    }

    /**
    Called after search button is clicked, navigates to search page
    @param 'query' - string to search
    */
    onSearchKeyUp(query: string){
        this.router.navigate(['/templates/search', {query:query}]);
    }
    
    /**
    Celled after delete button on the template is clicked, calls http service to remove
    the template
    @param 'template' - template to remove
    */
    onDeleteClicked(template: Template){
        this.templateService.removeTemplate(template.id).subscribe(res => this.deleteFromList(template));
    }
    

    /**
    Called after template is sucessfully removed, removes template from template list
    @param 'template' - template to remove
    */
    deleteFromList(template: Template){
        var index = this.allTemplates.indexOf(template);
        this.allTemplates.splice(index,1);
    }
    

    /*
    Called on initiation, calls http service to get public templates
    */
    getPublicTemplates(){
        this.templateService.getPublicTemplates().subscribe(
            templates => {
                this.publicTemplates = templates
                this.loading = false
            },
            error =>  this.error = <any>error
        );
    }
    
    /*
    Called when add tmeplate button is clicked, displays dialog to set editor parameters
    */
    onAddTemplateClicked(){
        let dialogRef = this.dialog.open(CreateTemplateModal, { height: 'auto', width: '30%',disableClose: false})
        dialogRef.afterClosed().subscribe(val =>{
            if(!val){
                return 
            }
            let width
            let height
            switch(val.type){
                case('A3'): 
                    height = Page.presetDimensions.A3.height
                    width = Page.presetDimensions.A3.width
                    break
                case('A4'):
                    height = Page.presetDimensions.A4.height
                    width = Page.presetDimensions.A4.width
                    break
                case('A5'):
                    height = Page.presetDimensions.A5.height
                    width = Page.presetDimensions.A5.width
                    break
                case('custom'):
                    height = val.height
                    width = val.width
                    break
            }
            if(val.type !== 'custom' && val.orientation == 1){
                    let temp = width
                    width = height
                    height = temp
            }
            this.router.navigate(['/templates/new', {width:width,height:height,margin:val.margin}])
        })
        dialogRef.componentInstance.title = "VYTVOŘIT ŠABLONU"
    }

    onUserClicked(id: number){
        let dialogRef = this.dialog.open(DisplayUserComponent, { height: 'auto', width: '50%', panelClass: 'user-detail-dialog'})
        dialogRef.componentInstance.id = id
    }     
}