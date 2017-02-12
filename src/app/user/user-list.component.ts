import { Component,Input, Output, EventEmitter} from '@angular/core';
import { User } from '../user/user'
import { Router } from '@angular/router'
import { TemplateInstance} from '../template-instance/template-instance';
 
@Component({
    selector: 'user-list',
    template: `
        <md-nav-list>
            <md-list-item *ngFor="let user of users">
                <a md-line href="...">{{ user.name }}</a>
                <a md-button [routerLink] = "['/users', user.id, 'templates']">Templates</a>
                <a md-button [routerLink] = "['/users', user.id, 'template-instances']">Documents</a>
            </md-list-item>
        </md-nav-list>
    `,
})

export class UserListComponent {
    
    mode = 'Observable';
    
    
    @Input()
    users: User[] 
        
}