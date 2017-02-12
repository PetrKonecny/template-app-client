import { Component, OnInit, Input} from '@angular/core';
import {TemplateListComponent} from './template-list.component';
import { TemplateService } from './template.service';
import { UserService } from '../user/user.service';
import { Template} from './template';
import { Observable }     from 'rxjs/Observable';
import {User } from '../user/user'
import {ActivatedRoute} from '@angular/router';

@Component({
    selector: 'user-templates',
    template: `
        <template-list [templates] = "templates" (onDeleteClicked) = "onDeleteClicked($event)"></template-list>
    `,
    providers: []
})

export class UserTemplatesComponent implements OnInit {
    
    errorMessage: string;
    templates : Template[];

    constructor(
        private templateService: TemplateService, private userService: UserService, private route: ActivatedRoute
    ){}

    ngOnInit(){
        this.route.params.subscribe(params => {
            let id = +params['id']; // (+) converts string 'id' to a number
            this.userService.getUserTemplates(id).subscribe(
                templates=>this.templates = templates,
                error => this.errorMessage = <any>error
            )
        })
    }
    
    
    onDeleteClicked(template: Template){
        this.templateService.removeTemplate(template.id).subscribe(res => this.deleteFromList(template));
    }
    
    deleteFromList(template: Template){
        var index = this.templates.indexOf(template);
        this.templates.splice(index,1);
    } 
     
}
