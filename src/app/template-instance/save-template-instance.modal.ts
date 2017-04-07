import { Component, Input} from '@angular/core';
import { Observable }     from 'rxjs/Observable';
import { FormBuilder, Validators } from '@angular/forms';
import {MdDialogRef} from '@angular/material'
import { TemplateInstance} from '../template-instance/template-instance';

@Component({
    selector: 'template-instance-save-modal',
    template: `
        <form [formGroup]="saveForm" (ngSubmit)="onSaveButtonClicked()">
        		<h2 md-dialog-title>ULOŽIT DOKUMENT</h2>
                <hr>
        		<md-dialog-content>
                    <div>
        			<md-input-container style="width: 100%;">
	                	<input mdInput [(ngModel)]="templateInstance.name" formControlName="name" type="text" placeholder="Název dokumentu">
                        <md-hint *ngIf="saveForm.controls['name'].hasError('required') && saveForm.controls['name'].touched"  style="color:red;">Name is required</md-hint>	                
                	</md-input-container>
                    </div>
                    <div>
                     <tag-input [(ngModel)]="templateInstance.tagged" [identifyBy]="'id'" [displayBy]="'tag_name'" formControlName="tags">
                      </tag-input>
                    </div>
                    <br>
                    <hr>
                    <div style="float: right;">
          			<button  md-raised-button color="primary" type = "submit" [disabled]="!saveForm.valid">Uložit</button>
          			<button  md-raised-button color="primary" md-dialog-close type = "button">Zrušit</button>
                    </div>
          		</md-dialog-content>
        </form>
    `,
    providers: []
})

export class SaveTemplateInstanceModal  {
	
	@Input()
	templateInstance: TemplateInstance

	public saveForm = this.fb.group({
        name: ["", Validators.required],
        tags: [""]
    });

	constructor(private fb: FormBuilder, private ref: MdDialogRef<SaveTemplateInstanceModal>){}

	onSaveButtonClicked(){
        if(this.saveForm.valid){
		    this.ref.close('save')
        }
	}
     
}