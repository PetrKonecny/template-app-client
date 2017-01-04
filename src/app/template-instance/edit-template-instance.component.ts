import { Component, OnInit} from '@angular/core';
import { TemplateInstanceStore } from './template-instance.store';
import { TemplateInstance} from './template-instance';
import { Router, ActivatedRoute} from '@angular/router'
import { Template} from '../template/template';

@Component({
    selector: 'template-edit',
    template: `
        <h2>Edit Template Instance</h2>
        <create-new-template-instance [templateInstance] = "templateInstance" [template] = "template"></create-new-template-instance>
    `,
    providers: []
})

export class TemplateInstanceEditComponent implements OnInit  {
    
    errorMessage: string;
    templateInstance : TemplateInstance;
    template : Template;
    private sub: any;
    
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private templateInstanceStore: TemplateInstanceStore 
    ){ }
      
    ngOnInit(){
        this.sub = this.route.params.subscribe(params => {
            let id = +params['id']; // (+) converts string 'id' to a number
            this.templateInstanceStore.getTemplateInstance(id);        
            this.templateInstanceStore.templateInstance.subscribe(templateInstance => {
                this.templateInstance = templateInstance
            });
            this.templateInstanceStore.template.subscribe(template => {
                this.template = template
                this.templateInstanceStore.copyContentsFromTemplate()
                this.templateInstanceStore.getContentsFromTemplateInstance()                
            });
        });
    }
}