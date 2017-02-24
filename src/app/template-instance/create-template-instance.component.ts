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
        <create-new-template-instance [template] = "template" [templateInstance] = "templateInstance"></create-new-template-instance>
    `,
    providers: [TemplateInstanceService,TemplateService]
})

export class TemplateInstanceCreateComponent implements OnInit  {
    
    errorMessage: string;
    templateInstance : TemplateInstance;
    template : Template;

    constructor(
        private route: ActivatedRoute,
        private templateInstanceStore: TemplateInstanceStore 
    ){ }
    
    ngOnInit(){
        this.route.params
        .map(params => {
            let id = +params['id']; // (+) converts string 'id' to a number
            this.templateInstanceStore.getTemplate(id);
        }).flatMap(() => this.templateInstanceStore.template)
        .map(res => {return {template: res}})
        .flatMap((res) => this.templateInstanceStore.templateInstance.map(templateInstance => {return{template: res.template, templateInstance: templateInstance}}))
        .first(res => res.template.id > 0)
        .subscribe(res => {
                this.template = res.template
                this.templateInstance = res.templateInstance                 
                this.templateInstanceStore.copyContentsFromTemplate();
                this.templateInstanceStore.getContentsFromTemplateInstance();
                }
        )
    }
}