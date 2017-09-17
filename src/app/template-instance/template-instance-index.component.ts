import { Component, OnInit} from '@angular/core';
import {TemplateInstanceListComponent} from './template-instance-list.component';
import { TemplateInstanceService } from './template-instance.service';
import { TemplateInstance} from './template-instance';
import { Observable }     from 'rxjs/Observable';
import { UserStore } from '../user/user.store'
import { AppConfig }from '../app.config'
import { MdDialog, MdDialogRef } from '@angular/material'
import { CreateTemplateModal } from '../template/create-template.modal'
import { Page } from '../page/page'
import { Router } from '@angular/router'

@Component({
    selector: 'template-instance-index',
    template: `
        <div class="shutter">
            <md-spinner *ngIf="loading && !error"></md-spinner>
            <md-icon class="shutter" style="font-size: 96px; opacity: 0.1;" *ngIf="error">error</md-icon>
        </div>
        <md-toolbar style="position: fixed; z-index: 5;">
                <button md-button *ngIf="showEditButton()" [routerLink] = "['/template-instances', selected[0].id]">OTEVŘÍT DOKUMENT</button>
                <button md-button *ngIf="showDeleteButton()" (click)="onDeleteClicked(selected[0])">SMAZAT DOKUMENT</button>
                <a md-button *ngIf="showPdfButton()" href="{{config.getConfig('api-url')}}/templateInstance/{{selected[0].id}}/pdf"  target="_blank">PDF</a>
        </md-toolbar>
        <div class ="index-content">
            <ngx-datatable style="padding-top: 64px;" *ngIf="templateInstances?.length"
                     class="material"
                    [columnMode]="'force'"
                    [headerHeight]="50"
                    [footerHeight]="0"
                    [rowHeight]="'auto'"
                    [selected]="selected"
                    [selectionType]="'single'"
                    [rows]="templateInstances"
                >
                <ngx-datatable-column prop="name" name="název">
                </ngx-datatable-column>
                <ngx-datatable-column prop="tagged" name="tagy">
                    <ng-template  let-value="value" ngx-datatable-cell-template>
                    <md-chip-list>
                    <md-chip *ngFor="let tag of value">{{tag.tag_name}}</md-chip>
                    </md-chip-list>
                    </ng-template>
                </ngx-datatable-column>
                <ngx-datatable-column prop="updated_at" name="naposledy upraveno">
                    <ng-template  let-value="value" ngx-datatable-cell-template>
                    {{value | date : 'short'}}
                    </ng-template>
                </ngx-datatable-column>
            </ngx-datatable>
        </div>
        <button md-fab class="index-button" (click)="onAddTemplateClicked()"><md-icon>add</md-icon></button>
    `,
    providers: []
})

//displays index page containing user documents
export class TemplateInstanceIndexComponent implements OnInit  {
    
    //error thrown when loading the documents
    error: string
    //loading indicator
    loading = true
    //array of documents to be displayed
    templateInstances : TemplateInstance[]

    selected: TemplateInstance[] = []

    /**
    @param templateInstanceService - service to get docuemnts form API
    @param userStore - store containing current user
    */
    constructor(
        private config: AppConfig, 
        private templateInstanceService: TemplateInstanceService, 
        private userStore: UserStore, 
        public dialog: MdDialog, 
        private router: Router
    ){ }
    
    showEditButton(){
        return this.selected.length
    }

    showDeleteButton(){
        return this.selected.length
    }

    showPdfButton(){
        return this.selected.length
    }
    //loads documents for user
    ngOnInit(){
        this.userStore.user
        .first(user=>user.id > 0)
        .flatMap(user => this.templateInstanceService.getTemplateInstancesForUser(user.id))
        .subscribe(
            templateInsts =>{
                this.templateInstances = templateInsts
                this.loading = false
            },error => {
                this.error = error
            }
        )

    }
    
    //triggered when delete button clicked
    onDeleteClicked(instance: TemplateInstance){
        this.templateInstanceService.removeTemplateInstance(instance.id).subscribe(res => this.deleteFromList(instance));
    }
    
    //removes document from the list
    deleteFromList(instance: TemplateInstance){
        var index = this.templateInstances.indexOf(instance);
        this.templateInstances.splice(index,1);
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
            this.router.navigate(['/template-instances/new', {width:width,height:height,margin:val.margin}])
        })
    }    
     
}