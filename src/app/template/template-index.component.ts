import { Component, OnInit} from '@angular/core';
import {TemplateListComponent} from './template-list.component';
import { TemplateService } from './template.service';
import { Template} from './template';
import { Observable }     from 'rxjs/Observable';
import { Router } from '@angular/router'
import {MdDialog, MdDialogRef} from '@angular/material'
import {CreateTemplateModal} from './create-template.modal'
import {Page} from '../page/page'
import {UserStore} from '../user/user.store'
import {User} from '../user/user'

@Component({
    selector: 'template-index',
    template: `
        <form (ngSubmit)="onSearchKeyUp(search.value)">
            <md-input-container><input #search mdInput type="search"></md-input-container>
            <button md-button>SEARCH</button>
        </form>
        <div class="shutter">
            <md-spinner *ngIf="loading && !error"></md-spinner>
            <md-icon class="shutter" style="font-size: 96px; opacity: 0.1;" *ngIf="error">error</md-icon>
        </div>
        <div *ngIf="templates && publicTemplates && currentUser">
            <h3>Vaše šablony</h3>
            <template-list [templates] = "templates" [user]="currentUser" (onDeleteClicked) = "onDeleteClicked($event)"></template-list>
            <h3>Veřejné šablony</h3>
            <template-list [templates] = "publicTemplates" [user]="currentUser" (onDeleteClicked) = "onDeleteClicked($event)"></template-list>
        </div>
        <button md-fab class="index-button" (click)="onAddTemplateClicked()"><md-icon>add</md-icon></button>
    `,
    providers: []
})

export class TemplateIndexComponent implements OnInit  {
    
    error: string
    templates : Template[]
    publicTemplates : Template[]
    loading = true
    currentUser : User

    constructor(
        private templateService: TemplateService, private router: Router, public dialog: MdDialog, private userStore: UserStore 
    ){ }
    
    
    ngOnInit(){
        this.userStore.user.first(user => user.id > 0)
        .do((user)=>{this.currentUser = user})
        .flatMap(user => Observable.forkJoin(this.templateService.getTemplatesForUser(user.id),this.templateService.getPublicTemplates()))
        .subscribe(res => {
                this.templates = res[0]
                this.publicTemplates = res[1]   
                this.publicTemplates = this.publicTemplates.filter((template)=> {return !this.templates.some(template2 => template.id == template2.id)})
                this.loading = false
            }
            ,error=>{
                this.error = error
            }
        )
    }

    onSearchKeyUp(query: string){
        this.router.navigate(['/templates/search', {query:query}]);
    }
    
    onDeleteClicked(template: Template){
        this.templateService.removeTemplate(template.id).subscribe(res => this.deleteFromList(template));
    }
    
    deleteFromList(template: Template){
        var index = this.templates.indexOf(template);
        this.templates.splice(index,1);
    }
    
    getPublicTemplates(){
        this.templateService.getPublicTemplates().subscribe(
            templates => {
                this.publicTemplates = templates
                this.loading = false
            },
            error =>  this.error = <any>error
        );
    }

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
            this.router.navigate(['/templates/new', {width:width,height:height}])
        })
    }     
}