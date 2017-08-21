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
	                	<input mdInput formControlName="name" type="text" placeholder="Název dokumentu">
                        <md-hint *ngIf="saveForm.controls['name'].hasError('required') && saveForm.controls['name'].touched"  style="color:red;">Name is required</md-hint>	                
                	</md-input-container>
                    </div>
                    <div>
                        <tag-input [secondaryPlaceholder]="'Přidejte tagy'" [identifyBy]="'id'" [displayBy]="'tag_name'" formControlName="tagged">
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

//dialog containing options for savign the document
export class SaveTemplateInstanceModal  {
	
	
	public saveForm = this.fb.group({
        name: ["", Validators.required],
        tagged: [""]
    });

    /**
    @param fb - formBuilder used to creating forms
    @param ref - reference to the dialog
    */
	constructor(private fb: FormBuilder, private ref: MdDialogRef<SaveTemplateInstanceModal>){}

    setTemplateInstance(instance: TemplateInstance){
        this.saveForm.patchValue(instance)
    }

    //triggered when subniting the form
	onSaveButtonClicked(){
        if(this.saveForm.valid){
		    this.ref.close(this.saveForm.value)
        }
	}
     
}