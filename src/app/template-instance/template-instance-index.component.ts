import { Component, OnInit} from '@angular/core';
import {TemplateInstanceListComponent} from './template-instance-list.component';
import { TemplateInstanceService } from './template-instance.service';
import { TemplateInstance} from './template-instance';
import { Observable }     from 'rxjs/Observable';
import { UserStore } from '../user/user.store'


@Component({
    selector: 'template-instance-index',
    template: `
        <div class="shutter">
            <md-spinner *ngIf="loading && !error"></md-spinner>
            <md-icon class="shutter" style="font-size: 96px; opacity: 0.1;" *ngIf="error">error</md-icon>
        </div>
        <template-instance-list class="template-instance-list" *ngIf="templateInstances" [templateInstances] = "templateInstances" (onDeleteClicked) = "onDeleteClicked($event)"></template-instance-list>
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

    /**
    @param templateInstanceService - service to get docuemnts form API
    @param userStore - store containing current user
    */
    constructor(
        private templateInstanceService: TemplateInstanceService, private userStore: UserStore
    ){ }
    
    
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
     
}