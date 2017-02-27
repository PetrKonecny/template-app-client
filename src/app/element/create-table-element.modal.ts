import { Component, Input} from '@angular/core';
import { Observable }     from 'rxjs/Observable';
import { FormBuilder, Validators } from '@angular/forms';
import {MdDialogRef} from '@angular/material'
import {TableElement} from './table-element'

@Component({
    selector: 'create-table-modal',
    template: `
        <form [formGroup]="createForm" (ngSubmit)="onSaveButtonClicked()">
        		<h2 md-dialog-title>CREATE TABLE</h2>
                <hr>
        		<md-dialog-content>
                    <div>
            			<md-input-container style="width: 100%;">
    	                	<input mdInput formControlName="rows" type="number" placeholder="Nuber of rows">
                    	</md-input-container>
                        <md-input-container style="width: 100%;">
                            <input mdInput formControlName="columns" type="number" placeholder="Number of columns">
                        </md-input-container>
                        <md-input-container style="width: 100%;">
                            <input mdInput formControlName="rowHeight" type="number" placeholder="Row height">
                        </md-input-container>
                        <md-input-container style="width: 100%;">
                            <input mdInput formControlName="columnWidth" type="number" placeholder="Column height">
                        </md-input-container>
                    </div>
                    <div style="float: right;">
          			<button  md-raised-button color="primary" type = "submit" [disabled]="!createForm.valid">Create</button>
          			<button  md-raised-button color="primary" md-dialog-close type = "button">Close</button>
                    </div>
          		</md-dialog-content>
        </form>
    `,
    providers: []
})

export class CreateTableModal  {

	public createForm = this.fb.group({
        rows: [5, Validators.required],
        columns: [5,Validators.required],
        rowHeight: [TableElement.default_row_height, Validators.required],
        columnWidth: [TableElement.default_cell_width, Validators.required]
    });

	constructor(private fb: FormBuilder, private ref: MdDialogRef<CreateTableModal>){}

	onSaveButtonClicked(){
        if(this.createForm.valid){
		    this.ref.close(this.createForm.value)
        }
	}
     
}