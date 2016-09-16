import { Component,Input} from '@angular/core';
import { TemplateService } from './template.service';
import { Template} from './template';
import { Router } from '@angular/router'
import { ROUTER_DIRECTIVES} from '@angular/router'
 

@Component({
    selector: 'template-list',
    template: `
        <ul class="heroes">
            <li *ngFor="let template of templates">
                <span class="badge">{{template.id}}</span> {{template.name}}
                <a [routerLink] = "['/templates', template.id, '/edit']">Edit</a>
                <a [routerLink] = "['/templates', template.id, '/instance']">New Instance</a>
            </li>
        </ul>
    `,  directives:[ROUTER_DIRECTIVES]
})

export class TemplateListComponent {
    
    mode = 'Observable';
    
    
    @Input()
    templates : Template[] 
    
    constructor(private router: Router){}
    
    onSelectEdit(template: Template) {
        this.router.navigate(['/templates', template.id, '/edit']);
    }
    
    onSelectInstance(template: Template) {
        this.router.navigate(['/templates', template.id, '/instance']);
    }
    
    
    
    onSelectNew(template: Template) {
        
    }    
}