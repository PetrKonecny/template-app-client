import { Component, Input} from '@angular/core';
import {TemplateListComponent} from './template-list.component';
import { TemplateService } from './template.service';
import { Template} from './template';
import { Observable }     from 'rxjs/Observable';
import { FormBuilder, Validators } from '@angular/forms';
import { TemplateInstanceStore } from '../template-instance/template-instance.store';
import {ActivatedRoute} from '@angular/router';

@Component({
    selector: 'template-edit-form',
    template: `
        <form style="padding: 10px;" [formGroup]="saveForm" (ngSubmit)="onSaveButtonClicked()">
    		<md-input-container style="width: 100%;">
            	<input mdInput [(ngModel)]="template.name" formControlName="name" type="text" placeholder="Template name">
        	</md-input-container>
            <md-input-container style="width: 100%;">
                <input mdInput [(ngModel)]="template.created_at" formControlName="createdAt" type="text" placeholder="Created at">
            </md-input-container>
            <md-input-container style="width: 100%;">
                <input mdInput [(ngModel)]="template.updated_at" formControlName="updatedAt" type="text" placeholder="Updated at">
            </md-input-container>
            <md-input-container style="width: 100%;">
                <input mdInput [(ngModel)]="template.public" formControlName="public" type="text" placeholder="Public">
            </md-input-container>
            <md-input-container style="width: 100%;">
                <input mdInput [(ngModel)]="template.user_id" formControlName="user_id" type="text" placeholder="User id">
            </md-input-container>                    
             <tag-input [(ngModel)]="template.tagged" [identifyBy]="'id'" [displayBy]="'tag_name'" formControlName="tags">
              </tag-input>                   
    			<button  md-raised-button color="primary" type = "submit" [disabled]="!saveForm.valid">Save</button>
        </form>
    `,
    providers: []
})

export class TemplateEditForm  {
	
	@Input()
	template: Template = new Template

	public saveForm = this.fb.group({
        name: [""],
        public: [],
        tags: [""],
        createdAt: [""],
        updatedAt: [""],
        user_id: [""],
    });

	constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private templateService: TemplateService,
    ){}

    ngOnInit(){
        this.route.params.subscribe(params => {
            let id = +params['id']; // (+) converts string 'id' to a number
            this.templateService.getTemplate(id).subscribe( template => {           
                this.template = template
            });
        });
    }

	onSaveButtonClicked(){
  
	}
     
}