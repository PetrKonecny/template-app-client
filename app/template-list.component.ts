import { Component,Input, Output, EventEmitter} from '@angular/core';
import { Template} from './template';
import { Router } from '@angular/router'
import { ROUTER_DIRECTIVES} from '@angular/router'
import { TemplateInstance} from './template-instance';
 
@Component({
    selector: 'template-list',
    template: `
        <ul class="heroes">
            <li *ngFor="let template of templates">
                <span class="badge">{{template.id}}</span> {{template.name}}
                <a [routerLink] = "['/templates', template.id, '/edit']">Edit</a>
                <a [routerLink] = "['/templates', template.id, '/instance']">New Instance</a>\n\
                <a href="javascript:void(0)"(click)="onDelete(template)">Delete</a>            
            </li>
        </ul>
    `,  directives:[ROUTER_DIRECTIVES]
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