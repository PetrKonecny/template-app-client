import { Component, OnInit} from '@angular/core';
import {NewTemplateInstanceComponent} from './new-template-instance.component';
import { TemplateInstanceService } from './template-instance.service';
import { TemplateService } from './template.service';
import { TemplateInstanceStore } from './template-instance.store';
import { TemplateInstance} from './template-instance';
import { Observable }     from 'rxjs/Observable';
import { Router, ActivatedRoute} from '@angular/router'
import { Template} from './template';


@Component({
    selector: 'template-create',
    template: `
        <h2>Edit Template Instance</h2>
        <create-new-template-instance [template] = "template" [templateInstance] = "templateInstance"></create-new-template-instance>
    `,
    directives: [NewTemplateInstanceComponent],
    providers: [TemplateInstanceService,TemplateInstanceStore,TemplateService]
})

export class TemplateInstanceCreateComponent implements OnInit  {
    
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
        this.templateInstanceStore.getTemplate(id);        
        this.templateInstanceStore.template.subscribe(template => this.template = template);
        this.templateInstanceStore.templateInstance.subscribe(templateInstance => this.templateInstance = templateInstance);
        });
    }
}