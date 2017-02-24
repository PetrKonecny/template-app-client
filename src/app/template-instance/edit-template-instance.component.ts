import { Component, OnInit} from '@angular/core';
import { TemplateInstanceStore } from './template-instance.store';
import { TemplateInstance} from './template-instance';
import { Router, ActivatedRoute} from '@angular/router'
import { Template} from '../template/template';
import { Observable } from 'rxjs/Rx'

@Component({
    selector: 'template-edit',
    template: `
        <create-new-template-instance [templateInstance] = "templateInstance" [template] = "template"></create-new-template-instance>
    `,
    providers: []
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