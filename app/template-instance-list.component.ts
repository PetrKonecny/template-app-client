import { Component,Input} from '@angular/core';
import { TemplateService } from './template.service';
import { TemplateInstance} from './template-instance';
import { Router } from '@angular/router'
 
@Component({
    selector: 'template-instance-list',
    template: `
        <ul class="heroes">
            <li *ngFor="let templateInstance of templateInstances"  (click)="onSelect(templateInstance)">
                <span class="badge">{{templateInstance.id}}</span> {{templateInstance.name}}
            </li>
        </ul>
    `
})

export class TemplateInstanceListComponent {
    
    
    
    @Input()
    templateInstances : TemplateInstance[] 
    
    constructor(private router: Router){}
    
    onSelect(templateInstance: TemplateInstance) {
        this.router.navigate(['/template-instances', templateInstance.id]);
    }
    
    
    
}