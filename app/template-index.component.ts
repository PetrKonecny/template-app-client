import { Component, OnInit} from '@angular/core';
import {TemplateListComponent} from './template-list.component';
import { TemplateService } from './template.service';
import { Template} from './template';
import { Observable }     from 'rxjs/Observable';
import { ROUTER_DIRECTIVES} from '@angular/router'


@Component({
    selector: 'template-index',
    template: `
        <h2>My Templates</h2>
        <template-list [templates] = templates></template-list>\n\
        <a [routerLink] = "['/templates/new']">New template</a>
    `,
    directives: [TemplateListComponent, ROUTER_DIRECTIVES],
    providers: [TemplateService]
})

export class TemplateIndexComponent implements OnInit  {
    
    errorMessage: string;
    templates : Template[];

    constructor(
        private templateService: TemplateService 
    ){ }
    
    
    ngOnInit(){
        this.getTemplates();
    }
    
    getTemplates(){
        this.templateService.getTemplates().subscribe(
                               templates => this.templates = templates,
                               error =>  this.errorMessage = <any>error
        );
    }
     
}