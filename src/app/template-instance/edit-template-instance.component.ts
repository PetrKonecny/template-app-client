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

@Component({
    selector: 'template-edit',
    template: `
        <create-new-template-instance [templateInstance] = "templateInstance" [template] = "template"></create-new-template-instance>
    `,
    providers: [UndoRedoService, TableElementCommands, TextContentCommands, ImageContentCommands, ElementCommands, PageCommands, TemplateCommands]
})

export class TemplateInstanceEditComponent implements OnInit  {
    
    errorMessage: string;
    templateInstance : TemplateInstance;
    template : Template;
    private subs: any[];
    
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private templateInstanceStore: TemplateInstanceStore,
        private templateStore: TemplateStore
    ){ }
      
    ngOnInit(){
        this.templateInstanceStore.cleanStore()
        this.templateStore.cleanStore()     
        this.route.params
        .map(params =>{
            let id = +params['id']; // (+) converts string 'id' to a number
            this.templateInstanceStore.getTemplateInstanceWithTemplate(id)
        })
        .flatMap(() => this.templateInstanceStore.templateInstance)
        .map(templateInstance => {return {templateInstance: templateInstance}})
        .flatMap((res) => this.templateStore.template.map(template=>{return {template: template, templateInstance: res.templateInstance}}))
        .first(res => res.template.id > 0 && res.templateInstance.id > 0)
        .subscribe(res => {
            this.template = res.template
            this.templateInstance = res.templateInstance
            TemplateInstanceHelper.copyContentsFromTemplate(res.templateInstance,res.template)
            TemplateInstanceHelper.getContentsFromTemplateInstance(res.templateInstance, res.template)  
        })
    }

    ngOnDe
}