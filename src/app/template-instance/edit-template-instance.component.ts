import { Component, OnInit} from '@angular/core';
import { TemplateInstance} from './template-instance';
import { Router, ActivatedRoute} from '@angular/router'
import { Observable } from 'rxjs/Rx'
import { TemplateInstanceStore } from '../template-instance/template-instance.store';
import { Template, TemplateCommands} from '../template/template';
import { ElementSelector } from '../element/element-selector';
import { ImageSelector } from '../image/image-selector';
import { PageSelector} from '../page/page-selector'
import { RulerSelector } from '../guide/ruler-selector'
import { TextSelector } from '../editor/text-selector'
import { UndoRedoService } from '../undo-redo.service'
import { TableElementCommands } from '../element/table-element'
import { TextContentCommands } from '../content/text-content'
import { ImageContentCommands } from '../content/image-content'
import { ElementCommands } from '../element/element'
import { PageCommands } from '../page/page'

@Component({
    selector: 'template-edit',
    template: `
        <create-new-template-instance [templateInstance] = "templateInstance" [template] = "template"></create-new-template-instance>
    `,
    providers: [ElementSelector, ImageSelector, PageSelector, RulerSelector, TextSelector, UndoRedoService, TableElementCommands, TextContentCommands, ImageContentCommands, ElementCommands, PageCommands, TemplateCommands]
})

export class TemplateInstanceEditComponent implements OnInit  {
    
    errorMessage: string;
    templateInstance : TemplateInstance;
    template : Template;
    private subs: any[];
    
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private templateInstanceStore: TemplateInstanceStore 
    ){ }
      
    ngOnInit(){     
        this.route.params
        .map(params =>{
            let id = +params['id']; // (+) converts string 'id' to a number
            this.templateInstanceStore.getTemplateInstanceWithTemplate(id)
            console.log(id)
        })
        .flatMap(() => this.templateInstanceStore.templateInstance)
        .map(templateInstance => {return {templateInstance: templateInstance}})
        .flatMap((res) => this.templateInstanceStore.template.map(template=>{return {template: template, templateInstance: res.templateInstance}}))
        .first(res => res.template.id > 0 && res.templateInstance.id > 0)
        .subscribe(res => {
            console.log(res.template,res.templateInstance)
            this.template = res.template
            this.templateInstance = res.templateInstance
            this.templateInstanceStore.copyContentsFromTemplate()
            this.templateInstanceStore.getContentsFromTemplateInstance()  
        })
    }

    ngOnDe
}