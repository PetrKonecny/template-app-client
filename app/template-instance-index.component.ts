import { Component, OnInit} from '@angular/core';
import {TemplateInstanceListComponent} from './template-instance-list.component';
import { TemplateInstanceService } from './template-instance.service';
import { TemplateInstance} from './template-instance';
import { Observable }     from 'rxjs/Observable';


@Component({
    selector: 'template-instance-index',
    template: `
        <h2>My Template Instances</h2>
        <template-instance-list [templateInstances] = "templateInstances" (onDeleteClicked) = "onDeleteClicked($event)"></template-instance-list>
    `,
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
    
    onDeleteClicked(instance: TemplateInstance){
        this.templateInstanceService.removeTemplateInstance(instance.id).subscribe(res => this.deleteFromList(instance));
    }
    
    deleteFromList(instance: TemplateInstance){
        var index = this.templateInstances.indexOf(instance);
        this.templateInstances.splice(index,1);
    }
     
}