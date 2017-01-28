import { Component,Input, Output, EventEmitter} from '@angular/core';
import { Template} from './template';
import { Router } from '@angular/router'
import { TemplateInstance} from '../template-instance/template-instance';
 
@Component({
    selector: 'template-list',
    template: `
        <md-nav-list>
            <md-list-item *ngFor="let template of templates">
                <a md-line href="...">{{ template.name }}</a>
                <a md-button [routerLink] = "['/templates', template.id, 'edit']">Edit</a>
                <a md-button [routerLink] = "['/templates', template.id, 'instance']">New </a>\n\
                <a md-button href="javascript:void(0)"(click)="onDelete(template)">Delete</a>            
            </md-list-item>
        </md-nav-list>
    `,
})

export class TemplateListComponent {
    
    mode = 'Observable';
    
    
    @Input()
    templates : Template[] 
    
    @Output() 
    onDeleteClicked = new EventEmitter<TemplateInstance>();

    
    constructor(private router: Router){}
    
    onSelectEdit(template: Template) {
        this.router.navigate(['/templates', template.id, '/edit']);
    }
    
    onSelectInstance(template: Template) {
        this.router.navigate(['/templates', template.id, '/instance']);
    }
    
    
    onDelete(templateInstance: TemplateInstance){
        this.onDeleteClicked.emit(templateInstance);
    }
    
    
        
    onSelectNew(template: Template) {
        
    }    
}