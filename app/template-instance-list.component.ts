import { Component,Input, Output, EventEmitter} from '@angular/core';
import { TemplateInstance} from './template-instance';
import { ROUTER_DIRECTIVES} from '@angular/router'

@Component({
    selector: 'template-instance-list',
    template: `
        <ul class="heroes">
            <li *ngFor="let templateInstance of templateInstances">
                <span class="badge">{{templateInstance.id}}</span> {{templateInstance.name}}
                <a [routerLink] = "['/template-instances', templateInstance.id]">Open</a>\n\
                <a href="http://localhost:8080/templateInstance/{{templateInstance.id}}/pdf">Open as pdf</a>\n\
                <a href="javascript:void(0)"(click)="onDelete(templateInstance)">Delete</a>
            </li>
        </ul>
    `
    ,  directives:[ROUTER_DIRECTIVES]
})

export class TemplateInstanceListComponent {
    
    
    
    @Input()
    templateInstances : TemplateInstance[] 
    
    @Output() 
    onDeleteClicked = new EventEmitter<TemplateInstance>();

    
    onDelete(templateInstance: TemplateInstance){
        this.onDeleteClicked.emit(templateInstance);
    }
        
}