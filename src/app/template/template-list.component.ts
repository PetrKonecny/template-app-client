import { Component,Input, Output, EventEmitter} from '@angular/core';
import { Template} from './template';
import { User } from '../user/user'
import { Router } from '@angular/router'
import { TemplateInstance} from '../template-instance/template-instance';

@Component({
    selector: 'template-list',
    template: `
        <md-nav-list>
            <md-list-item [routerLink] = "['/templates', template.id, 'instance']" *ngFor="let template of templates">
                <span md-line>{{ template.name }}</span>
                <md-chip-list md-line><md-chip *ngFor="let tag of template.tagged">{{tag.tag_name}}</md-chip></md-chip-list>
                <button md-icon-button (click)="onClick($event)" [mdMenuTriggerFor]="templateListItemMenu"><md-icon>more_vert</md-icon></button>
                <md-menu #templateListItemMenu="mdMenu">
                    <button md-menu-item *ngIf="user && user.id == template.user_id" [routerLink] = "['/templates', template.id, 'edit']">Upravit šablonu</button>
                    <button md-menu-item [routerLink] = "['/templates', template.id, 'instance']">Nový dokument</button>
                    <button md-menu-item *ngIf="user && user.id == template.user_id" href="javascript:void(0)"(click)="onDelete(template)">Smazat</button>
                </md-menu>            
            </md-list-item>
        </md-nav-list>
    `,
})

export class TemplateListComponent {
    
    mode = 'Observable';
    
    
    @Input()
    templates : Template[] 

    @Input()
    user: User
    
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
    
    
    onClick(event) {
       event.stopPropagation();
    }
        
    onSelectNew(template: Template) {
        
    }    
}