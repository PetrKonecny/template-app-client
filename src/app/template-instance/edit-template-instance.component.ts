import { Component, OnInit} from '@angular/core';
import { TemplateInstance} from './template-instance';
import { Router, ActivatedRoute} from '@angular/router'
import { Observable } from 'rxjs/Rx'
import { TemplateInstanceStore } from '../template-instance/template-instance.store';
import { Template, TemplateCommands} from '../template/template';
import { UndoRedoService } from '../undo-redo.service'
import { TableElementCommands } from '../element/table-element'
import { TextContentCommands } from '../content/text-content'
import { ImageContentCommands } from '../content/image-content'
import { ElementCommands } from '../element/element'
import { PageCommands } from '../page/page'
import { TemplateInstanceHelper} from './template-instance.helper'
import { TemplateStore } from '../template/template.store'
import { TemplateService } from '../template/template.service'
import { TemplateInstanceService } from '../template-instance/template-instance.service'
import { MdSnackBar } from '@angular/material';

@Component({
    selector: 'template-edit',
    template: `
        <div class="shutter">
          <md-spinner *ngIf="(!template || !templateInstance) && !error"></md-spinner>
          <md-icon class="shutter" style="font-size: 96px; opacity: 0.1;" *ngIf="error">error</md-icon>
        </div>
        <create-new-template-instance *ngIf="template && templateInstance" [templateInstance] = "templateInstance" [template] = "template"></create-new-template-instance>
    `,
    providers: [UndoRedoService, TableElementCommands, TextContentCommands, ImageContentCommands, ElementCommands, PageCommands, TemplateCommands]
})

export class TemplateInstanceEditComponent implements OnInit  {
    
    error: string;
    templateInstance : TemplateInstance;
    template : Template;
    private subs: any[];
    
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private templateInstanceStore: TemplateInstanceStore,
        private templateStore: TemplateStore,
        private templateService: TemplateService,
        private templateInstanceService: TemplateInstanceService,
        private snackBar: MdSnackBar
    ){ }
      
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
                console.log(error)
                this.snackBar.open("Chyba při načítání dokumentu",null,{duration: 1500})
            }
        )
    }

}