import { Component, OnInit} from '@angular/core';
import { TemplateInstanceService } from './template-instance.service';
import { TemplateService } from '../template/template.service';
import { TemplateInstance} from './template-instance';
import { ActivatedRoute} from '@angular/router'
import { TemplateInstanceStore } from '../template-instance/template-instance.store';
import { Template } from '../template/template';
import { UndoRedoService } from '../undo-redo.service'
import { TemplateStore } from '../template/template.store'
import { TemplateInstanceHelper} from './template-instance.helper'
import { MdSnackBar } from '@angular/material';
import { ElementStore } from '../element/element.store'
import { PageStore } from '../page/page.store'

@Component({
    selector: 'template-create',
    template: `
        <div class="shutter">
          <md-spinner *ngIf="(!template || !templateInstance) && !error"></md-spinner>
          <md-icon style="font-size: 96px; opacity: 0.1;" *ngIf="error">error</md-icon>
        </div>
        <create-new-template-instance *ngIf="template && templateInstance" [template] = "template" [templateInstance] = "templateInstance"></create-new-template-instance>
    `,
    providers: [UndoRedoService, ElementStore, PageStore]
})
//displays index page for creating new document
export class TemplateInstanceCreateComponent implements OnInit  {
    
    //error thrown when loading template or document
    error: string;
    //created document
    templateInstance : TemplateInstance;
    //template belonging to the document
    template : Template;

    /**
    @param route - injects route service to get route params from the route
    @param templateInstanceStore - injects store containing the current document
    @param templateStore - injects store containing the current template
    @param mdSnackBar - injects snackbar to display error on
    */
    constructor(
        private route: ActivatedRoute,
        private templateInstanceStore: TemplateInstanceStore,
        private templateStore: TemplateStore,
        private snackBar: MdSnackBar 
    ){ }
    
    //loads template and template instances , copies their contents into eachother
    ngOnInit(){
        this.templateInstanceStore.cleanStore()
        this.templateStore.cleanStore()

        this.templateStore.template
        .flatMap((template)=>this.templateInstanceStore.templateInstance.map((templateInstance)=>{return{template: template, templateInstance: templateInstance}}))
        .first((res)=> res.template.id > 0)
        .subscribe((res)=>{       
            this.template = res.template
            this.templateInstance = res.templateInstance
            this.templateInstance.template_id = this.template.id
            TemplateInstanceHelper.copyContentsFromTemplate(this.templateInstance, this.template);
            TemplateInstanceHelper.getContentsFromTemplateInstance(this.templateInstance,this.template);
            this.templateInstance.name = this.template.name
            this.templateInstance.tagged = this.template.tagged
        })

        this.route.params
        .flatMap((params) => this.templateStore.getTemplate(params['id']))
        .first()
        .subscribe(
            res => {                               
                
            }
            ,error =>{
                this.error = error
                this.snackBar.open("Chyba při načítání dokumentu",null,{duration: 1500})
            }
        )
    }
}