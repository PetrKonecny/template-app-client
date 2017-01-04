import { Component, OnInit} from '@angular/core';
import { TemplateInstanceService } from './template-instance.service';
import { TemplateService } from '../template/template.service';
import { TemplateInstanceStore } from './template-instance.store';
import { TemplateInstance} from './template-instance';
import { ActivatedRoute} from '@angular/router'
import { Template} from '../template/template';


@Component({
    selector: 'template-create',
    template: `
        <h2>Create Template Instance</h2>
        <create-new-template-instance [template] = "template" [templateInstance] = "templateInstance"></create-new-template-instance>
    `,
    providers: [TemplateInstanceService,TemplateService]
})

export class TemplateInstanceCreateComponent implements OnInit  {
    
    errorMessage: string;
    templateInstance : TemplateInstance;
    template : Template;
    private sub: any;

    constructor(
        private route: ActivatedRoute,
        private templateInstanceStore: TemplateInstanceStore 
    ){ }
    
    ngOnInit(){
        this.sub = this.route.params.subscribe(params => {
        let id = +params['id']; // (+) converts string 'id' to a number
        this.templateInstanceStore.getTemplate(id);        
        this.templateInstanceStore.templateInstance.subscribe(templateInstance => this.templateInstance = templateInstance);
        this.templateInstanceStore.template.subscribe(template => {
                this.template = template                
                this.templateInstanceStore.copyContentsFromTemplate();
                this.templateInstanceStore.getContentsFromTemplateInstance();
            });
        });
    }
}