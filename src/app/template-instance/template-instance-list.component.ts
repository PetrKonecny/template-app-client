import { Component,Input, Output, EventEmitter} from '@angular/core';
import { TemplateInstance} from './template-instance';
import { AppConfig }from '../app.config'

@Component({
    selector: 'template-instance-list',
    template: `
        <md-nav-list>
            <md-list-item *ngFor="let templateInstance of templateInstances">
                <a md-line href="...">{{ templateInstance.name? templateInstance.name : "Nepojmenovaný dokument" }}</a>
                <a md-button [routerLink] = "['/template-instances', templateInstance.id]">Open</a>
                <a md-button href="{{config.getConfig('api-url')}}/templateInstance/{{templateInstance.id}}/pdf">PDF</a>\n\
                <a md-button href="javascript:void(0)"(click)="onDelete(templateInstance)">Delete</a>            
            </md-list-item>
        </md-nav-list>
    `
})

export class TemplateInstanceListComponent {
    
    
    
    @Input()
    templateInstances : TemplateInstance[] 
    
    @Output() 
    onDeleteClicked = new EventEmitter<TemplateInstance>();

    constructor(private config: AppConfig){

    }

    
    onDelete(templateInstance: TemplateInstance){
        this.onDeleteClicked.emit(templateInstance);
    }
        
}