import { Component, OnInit, AfterViewInit} from '@angular/core';
import { TemplateInstanceStore } from '../template-instance/template-instance.store';
import { Template} from './template';
import { ElementSelector } from '../element/element-selector';
import { ImageSelector } from '../image/image-selector';
import { StepSelector } from '../step-selector'
import { PageSelector} from '../page/page-selector'
import { RulerSelector } from '../guide/ruler-selector'
import { TextSelector } from '../editor/text-selector'

@Component({
    selector: 'template-create',
    template: `
        <create-new-template *ngIf="template" [template] = template></create-new-template>
    `,
    providers: [ElementSelector, ImageSelector, StepSelector, PageSelector, RulerSelector, TextSelector]
})

export class TemplateCreateComponent implements OnInit, AfterViewInit  {
    
    errorMessage: string;
    template : Template;


    constructor(
        private templateService: TemplateInstanceStore, private pageSelector: PageSelector 
    ){ }
    
    
    ngOnInit(){
        this.templateService.cleanStore();
        this.templateService.template.subscribe( template => {
            this.template = template
            this.templateService.createContentsForTemplate()
            this.templateService.filloutNewTemplate()
        });
    }

    ngAfterViewInit(){
        this.pageSelector.selectPage(this.template.pages[0])
    }
}