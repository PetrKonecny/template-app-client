import { Component, OnInit} from '@angular/core';
import {TemplateListComponent} from './template-list.component';
import { TemplateService } from './template.service';
import { Template} from './template';
import { Observable }     from 'rxjs/Observable';

@Component({
    selector: 'template-index',
    template: `
        <template-list [templates] = "templates" (onDeleteClicked) = "onDeleteClicked($event)"></template-list>\n\
        <button md-fab [routerLink] = "['/templates/new']"><md-icon>add</md-icon></button>
    `,
    providers: []
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
    
    onDeleteClicked(template: Template){
        this.templateService.removeTemplate(template.id).subscribe(res => this.deleteFromList(template));
    }
    
    deleteFromList(template: Template){
        var index = this.templates.indexOf(template);
        this.templates.splice(index,1);
    }
    
    getTemplates(){
        this.templateService.getTemplates().subscribe(
                               templates => this.templates = templates,
                               error =>  this.errorMessage = <any>error
        );
    }
     
}