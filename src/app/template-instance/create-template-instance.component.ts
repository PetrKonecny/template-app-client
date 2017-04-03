import { Component, OnInit} from '@angular/core';
import { TemplateInstanceService } from './template-instance.service';
import { TemplateService } from '../template/template.service';
import { TemplateInstance} from './template-instance';
import { ActivatedRoute} from '@angular/router'
import { TemplateInstanceStore } from '../template-instance/template-instance.store';
import { Template, TemplateCommands} from '../template/template';
import { UndoRedoService } from '../undo-redo.service'
import { TableElementCommands } from '../element/table-element'
import { TextContentCommands } from '../content/text-content'
import { ImageContentCommands } from '../content/image-content'
import { ElementCommands } from '../element/element'
import { PageCommands } from '../page/page'
import { TemplateStore } from '../template/template.store'
import { TemplateInstanceHelper} from './template-instance.helper'
import { MdSnackBar } from '@angular/material';

@Component({
    selector: 'template-create',
    template: `
        <div class="shutter">
          <md-spinner *ngIf="(!template || !templateInstance) && !error"></md-spinner>
          <md-icon class="shutter" style="font-size: 96px; opacity: 0.1;" *ngIf="error">error</md-icon>
        </div>
        <create-new-template-instance [template] = "template" [templateInstance] = "templateInstance"></create-new-template-instance>
    `,
    providers: [UndoRedoService, TableElementCommands, TextContentCommands, ImageContentCommands, ElementCommands, PageCommands, TemplateCommands]
})

export class TemplateInstanceCreateComponent implements OnInit  {
    
    error: string;
    templateInstance : TemplateInstance;
    template : Template;

    constructor(
        private route: ActivatedRoute,
        private templateInstanceStore: TemplateInstanceStore,
        private templateStore: TemplateStore,
        private snackBar: MdSnackBar 
    ){ }
    
    ngOnInit(){
        this.templateInstanceStore.cleanStore()
        this.templateStore.cleanStore()   
        this.route.params
        .map(params => {
            let id = +params['id']; // (+) converts string 'id' to a number
            this.templateStore.getTemplate(id);
        }).flatMap(() => this.templateStore.template)
        .map(res => {return {template: res}})
        .flatMap((res) => this.templateInstanceStore.templateInstance.map(templateInstance => {return{template: res.template, templateInstance: templateInstance}}))
        .first(res => res.template.id > 0)
        .subscribe(res => {
                this.template = res.template
                this.templateInstance = res.templateInstance                 
                TemplateInstanceHelper.copyContentsFromTemplate(res.templateInstance, res.template);
                TemplateInstanceHelper.getContentsFromTemplateInstance(res.templateInstance,res.template);
                this.templateInstance.template_id = this.template.id
                }
                ,error =>{
                    this.error = error
                    this.snackBar.open("Chyba při načítání dokumentu",null,{duration: 1500})
                }
        )
    }
}