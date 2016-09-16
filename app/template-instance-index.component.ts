import { Component, OnInit} from '@angular/core';
import {TemplateInstanceListComponent} from './template-instance-list.component';
import { TemplateInstanceService } from './template-instance.service';
import { TemplateInstance} from './template-instance';
import { Observable }     from 'rxjs/Observable';


@Component({
    selector: 'template-instance-index',
    template: `
        <h2>My Template Instances</h2>
        <template-instance-list [templateInstances] = templateInstances></template-instance-list>
    `,
    directives: [TemplateInstanceListComponent],
    providers: [TemplateInstanceService]
})

export class TemplateInstanceIndexComponent implements OnInit  {
    
    errorMessage: string;
    templateInstances : TemplateInstance[];

    constructor(
        private templateInstanceService: TemplateInstanceService 
    ){ }
    
    
    ngOnInit(){
        this.getTemplates();
    }
    
    getTemplates(){
        this.templateInstanceService.getTemplateInstances().subscribe(
                               templateInstances => this.templateInstances = templateInstances,
                               error =>  this.errorMessage = <any>error
        );
    }
     
}