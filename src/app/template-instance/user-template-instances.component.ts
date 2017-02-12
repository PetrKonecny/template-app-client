import { Component, OnInit, Input} from '@angular/core';
import {TemplateInstanceListComponent} from './template-instance-list.component';
import { TemplateInstanceService } from './template-instance.service';
import { UserService } from '../user/user.service';
import { TemplateInstance} from './template-instance';
import { Observable }     from 'rxjs/Observable';
import {User } from '../user/user'
import {ActivatedRoute} from '@angular/router';

@Component({
    selector: 'user-template-instances',
    template: `
        <template-instance-list [templateInstances] = "templateInstances" (onDeleteClicked) = "onDeleteClicked($event)"></template-instance-list>
    `,
    providers: []
})

export class UserTemplateInstancesComponent implements OnInit {
    
    errorMessage: string;
    templateInstances : TemplateInstance[];

    constructor(
        private templateInstanceService: TemplateInstanceService, private userService: UserService, private route: ActivatedRoute
    ){}

    ngOnInit(){
        this.route.params.subscribe(params => {
            let id = +params['id']; // (+) converts string 'id' to a number
            this.userService.getUserTemplateInstances(id).subscribe(
                templateInstances=>this.templateInstances = templateInstances,
                error => this.errorMessage = <any>error
            )
        })
    }
    
    
    onDeleteClicked(template: TemplateInstance){
        this.templateInstanceService.removeTemplateInstance(template.id).subscribe(res => this.deleteFromList(template));
    }
    
    deleteFromList(template: TemplateInstance){
        var index = this.templateInstances.indexOf(template);
        this.templateInstances.splice(index,1);
    } 
     
}
