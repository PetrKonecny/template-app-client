import { Component, OnInit} from '@angular/core';
import {NewTemplateComponent} from './new-template.component';
import { TemplateService } from './template.service';
import { Template} from './template';
import { Observable }     from 'rxjs/Observable';
import { Router, ActivatedRoute} from '@angular/router'


@Component({
    selector: 'template-edit',
    template: `
        <h2>Edit Template</h2>
        <create-new-template [template] = template></create-new-template>
    `,
    directives: [NewTemplateComponent],
    providers: [TemplateService]
})

export class TemplateEditComponent implements OnInit  {
    
    errorMessage: string;
    template : Template;
    private sub: any;


    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private templateService: TemplateService 
    ){ }
    
    
    ngOnInit(){
        this.template = new Template();
        this.sub = this.route.params.subscribe(params => {
        let id = +params['id']; // (+) converts string 'id' to a number
        this.templateService.getTemplate(id).subscribe(template => this.template = template);
        });
    }
}