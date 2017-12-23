import { Component, OnInit} from '@angular/core';
import { TemplateInstance} from './template-instance';
import { Router, ActivatedRoute} from '@angular/router'
import { Observable } from 'rxjs/Rx'
import { TemplateInstanceStore } from '../template-instance/template-instance.store';
import { Template } from '../template/template';
import { UndoRedoService } from '../undo-redo.service'
import { TableElementCommands } from '../element/table-element'
import { TextContentCommands } from '../content/text-content'
import { TemplateInstanceHelper} from './template-instance.helper'
import { TemplateStore } from '../template/template.store'
import { TemplateService } from '../template/template.service'
import { TemplateInstanceService } from '../template-instance/template-instance.service'
import { MdSnackBar } from '@angular/material';
import { ElementStore } from '../element/element.store'
import { PageStore } from '../page/page.store'

@Component({
    selector: 'template-edit',
    template: `
        <div class="shutter">
          <md-spinner *ngIf="(!template || !templateInstance) && !error"></md-spinner>
          <md-icon class="shutter" style="font-size: 96px; opacity: 0.1;" *ngIf="error">error</md-icon>
        </div>
        <create-new-template-instance *ngIf="template && templateInstance" [templateInstance] = "templateInstance" [template] = "template"></create-new-template-instance>
    `,
    providers: [UndoRedoService, TableElementCommands, TextContentCommands, ElementStore, PageStore]
})

//displays index page for editing the document
export class TemplateInstanceEditComponent implements OnInit  {
    
    //error thrown when loading document or template
    error: string;
    //document being edited
    templateInstance : TemplateInstance;
    //ttemplate belonging to the document
    template : Template;
    
    /**
    @param route - injects service to get the url params from
    @param templateInstanceStore - template instance store containing currrent document
    @param templateSotre - store containing template belonging to the document
    @param snackBar - snack bar displayed when errror is thrown
    */
    constructor(
        private route: ActivatedRoute,
        private templateInstanceStore: TemplateInstanceStore,
        private templateStore: TemplateStore,
        private snackBar: MdSnackBar
    ){ }
      
    //loads document based on id in url and its template
    ngOnInit(){
        this.templateInstanceStore.cleanStore()
        this.templateStore.cleanStore()  
    
        this.templateStore.template
        .flatMap((template)=>this.templateInstanceStore.templateInstance.map((templateInstance)=>{return{template: template, templateInstance: templateInstance}}))
        .first((res)=> res.template.id > 0 && res.templateInstance.id > 0)
        .subscribe((res)=>{         
            this.template = res.template
            this.templateInstance = res.templateInstance
            TemplateInstanceHelper.copyContentsFromTemplate(this.templateInstance, this.template);
            TemplateInstanceHelper.getContentsFromTemplateInstance(this.templateInstance,this.template);
        })

        this.route.params
        .flatMap((params)=>this.templateInstanceStore.getTemplateInstanceWithTemplate(params['id']))
        .subscribe(
            res=>{
            },
            error=>{
                this.error = error
                this.snackBar.open("Chyba při načítání dokumentu",null,{duration: 1500})
            }
        )
    }

}