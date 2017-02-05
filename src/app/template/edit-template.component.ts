import { Component, OnInit} from '@angular/core';
import { TemplateInstanceStore } from '../template-instance/template-instance.store';
import { Template} from './template';
import {ActivatedRoute} from '@angular/router';
import { ElementSelector } from '../element/element-selector';
import { ImageSelector } from '../image/image-selector';
import { StepSelector } from '../step-selector'
import { PageSelector} from '../page/page-selector'
import { RulerSelector } from '../guide/ruler-selector'
import { TextSelector } from '../editor/text-selector'

@Component({
    selector: 'template-edit',
    template: `
        <create-new-template *ngIf="template" [template] = template></create-new-template>
    `,
    providers: [ElementSelector, ImageSelector, StepSelector, PageSelector, RulerSelector, TextSelector]
})

export class TemplateEditComponent implements OnInit  {
    
    errorMessage: string;
    template : Template;
    private sub: any;


    constructor(
        private route: ActivatedRoute,
        private templateService: TemplateInstanceStore,
        private pageSelector: PageSelector 
    ){ }
    
    
    ngOnInit(){
        this.sub = this.route.params.subscribe(params => {
            let id = +params['id']; // (+) converts string 'id' to a number
            this.templateService.cleanStore();
            this.templateService.getTemplate(id);
            this.templateService.template.subscribe( template => {           
                this.template = template;
                this.templateService.createContentsForTemplate();
                if(this.template.pages && this.template.pages[0]){
                    this.pageSelector.selectPage(this.template.pages[0])
                }
            });
        });
    }
}