import { Component, OnInit} from '@angular/core';
import {NewTemplateComponent} from './new-template.component';
import { TemplateInstanceStore } from './template-instance.store';
import { Template} from './template';
import { Observable }     from 'rxjs/Observable';
import { Router, ActivatedRoute} from '@angular/router'
import { TemplateInstanceService } from './template-instance.service'
import { TemplateService } from './template.service';

@Component({
    selector: 'template-edit',
    template: `
        <h2>Edit Template</h2>
        <create-new-template *ngIf="template" [template] = template></create-new-template>
    `,
    directives: [NewTemplateComponent],
    providers: [TemplateInstanceStore, TemplateInstanceService, TemplateService]
})

export class TemplateEditComponent implements OnInit  {
    
    errorMessage: string;
    template : Template;
    private sub: any;


    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private templateService: TemplateInstanceStore 
    ){ }
    
    
    ngOnInit(){
        this.sub = this.route.params.subscribe(params => {
            let id = +params['id']; // (+) converts string 'id' to a number
            if(params['id'] != null){
                this.templateService.getTemplate(id);
            }
            this.templateService.template.subscribe( template => {
                this.template = template
                this.templateService.createContentsForTemplate()
            });
        });
    }
}