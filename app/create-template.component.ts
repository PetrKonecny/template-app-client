import { Component, OnInit} from '@angular/core';
import {NewTemplateComponent} from './new-template.component';
import { TemplateInstanceStore } from './template-instance.store';
import { Template} from './template';

@Component({
    selector: 'template-create',
    template: `
        <h2>Create Template</h2>
        <create-new-template *ngIf="template" [template] = template></create-new-template>
    `,
    directives: [NewTemplateComponent],
    providers: []
})

export class TemplateCreateComponent implements OnInit  {
    
    errorMessage: string;
    template : Template;


    constructor(
        private templateService: TemplateInstanceStore 
    ){ }
    
    
    ngOnInit(){
        this.templateService.cleanStore();
        this.templateService.template.subscribe( template => {
            this.template = template
            this.templateService.createContentsForTemplate()
        });
    }
}