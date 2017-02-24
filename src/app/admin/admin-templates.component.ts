import { Component, OnInit, Input} from '@angular/core';
import {TemplateListComponent} from '../template/template-list.component';
import { TemplateService } from '../template/template.service';
import { Template} from '../template/template';
import { Observable }     from 'rxjs/Observable';
import {User } from '../user/user'
import {ActivatedRoute} from '@angular/router';

@Component({
    selector: 'admin-templates',
    template: `
        <template-table [templates] = "templates" [loadingIndicator]="loading" (onDeleteClicked) = "onDeleteClicked($event)"></template-table>
    `,
    providers: []
})

export class AdminTemplatesComponent implements OnInit {
    
    errorMessage: string;
    templates : Template[];
    loading = true;

    constructor(
        private templateService: TemplateService
    ){}

    ngOnInit(){
        this.templateService.getTemplates().subscribe(
        templates=>{
            this.templates = templates
            this.loading = false
        },
        error =>{
            this.errorMessage = error
            this.loading = false
        })
    }
}
