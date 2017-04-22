import { Component,Input, Output, EventEmitter} from '@angular/core';
import { TemplateInstance} from './template-instance';
import { AppConfig }from '../app.config'

@Component({
    selector: 'template-instance-list',
    template: `
        <md-nav-list>
            <md-list-item *ngFor="let templateInstance of templateInstances">
                <span md-line>{{ templateInstance.name? templateInstance.name : "Nepojmenovaný dokument" }}</span>
                <md-chip-list md-line><md-chip *ngFor="let tag of templateInstance.tagged">{{tag.tag_name}}</md-chip></md-chip-list>
                <a md-button [routerLink] = "['/template-instances', templateInstance.id]">Open</a>
                <a md-button href="{{config.getConfig('api-url')}}/templateInstance/{{templateInstance.id}}/pdf"  target="_blank">PDF</a>\n\
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