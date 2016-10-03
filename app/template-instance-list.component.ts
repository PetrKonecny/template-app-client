import { Component,Input} from '@angular/core';
import { TemplateService } from './template.service';
import { TemplateInstance} from './template-instance';
import { Router } from '@angular/router'
import { ROUTER_DIRECTIVES} from '@angular/router'

@Component({
    selector: 'template-instance-list',
    template: `
        <ul class="heroes">
            <li *ngFor="let templateInstance of templateInstances">
                <span class="badge">{{templateInstance.id}}</span> {{templateInstance.name}}
                <a [routerLink] = "['/template-instances', templateInstance.id]">Open</a>\n\
                <a href="http://localhost:8080/templateInstance/{{templateInstance.id}}/pdf">Open as pdf</a>
            </li>
        </ul>
    `
    ,  directives:[ROUTER_DIRECTIVES]
})

export class TemplateInstanceListComponent {
    
    
    
    @Input()
    templateInstances : TemplateInstance[] 
    
    constructor(private router: Router){}
    
}