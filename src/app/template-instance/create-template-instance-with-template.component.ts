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
import { ElementStore } from '../element/element.store'
import { PageStore } from '../page/page.store'
import {PageFactory} from '../page/page.factory'

@Component({
    selector: 'template-instance-with-template-create',
    template: `
        <div class="shutter">
          <md-spinner *ngIf="(!template || !templateInstance) && !error"></md-spinner>
          <md-icon class="shutter" style="font-size: 96px; opacity: 0.1;" *ngIf="error">error</md-icon>
        </div>
        <create-new-template *ngIf="template && templateInstance" [template] = "template" [templateInstance] = "templateInstance"></create-new-template>
    `,
    providers: [UndoRedoService, TableElementCommands, TextContentCommands, ImageContentCommands, ElementCommands, PageCommands, TemplateCommands, ElementStore, PageStore]
})
//displays index page for creating new document
export class TemplateInstanceTemplateCreateComponent implements OnInit  {
    
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
        private snackBar: MdSnackBar,
        private factory: PageFactory 
    ){ }
    
    //loads template and template instances , copies their contents into eachother
    ngOnInit(){
        this.templateInstanceStore.cleanStore()
        this.templateStore.cleanStore()

        this.templateStore.template
        .flatMap((template)=>this.templateInstanceStore.templateInstance.map((templateInstance)=>{return{template: template, templateInstance: templateInstance}}))
        .first()
        .subscribe((res)=>{       
            this.template = res.template
            this.templateInstance = res.templateInstance
            this.template.singular = true
        })
        this.route.params.subscribe(params=>{
            let width = +params['width']
            let height = +params['height']
            let margin = +params['margin']
            this.template.singular = params['sing']
            if(width && height && width > 100 && width < 2000 && height > 100 && height < 2000 && margin >= 0){
                this.factory.setWidth(width).setHeight(height).setMargin(margin)                
            }
            if(!this.template.pages || this.template.pages.length < 1){
                    this.template.pages = []
                    this.template.pages.push(this.factory.build())
            }
        })

    }
}