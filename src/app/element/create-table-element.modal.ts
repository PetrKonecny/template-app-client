import { Component, Input} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {MdDialogRef} from '@angular/material'
import {TableElement} from './table-element'

@Component({
    selector: 'create-table-modal',
    template: `
        <form [formGroup]="createForm" (ngSubmit)="onFormSubmited()">
    		<h2 md-dialog-title>VYTVOŘIT TABULKU</h2>
            <hr>
    		<md-dialog-content>
                <div>
        			<md-input-container style="width: 100%;">
	                	<input mdInput formControlName="rows" type="number" placeholder="počet řádků">
                	</md-input-container>
                    <md-input-container style="width: 100%;">
                        <input mdInput formControlName="columns" type="number" placeholder="počet sloupců">
                    </md-input-container>
                    <md-input-container style="width: 100%;">
                        <input mdInput formControlName="rowHeight" type="number" placeholder="výška řádku">
                    </md-input-container>
                    <md-input-container style="width: 100%;">
                        <input mdInput formControlName="columnWidth" type="number" placeholder="výška sloupce">
                    </md-input-container>
                </div>
                <div style="float: right;">
      			<button  md-raised-button color="primary" type = "submit" [disabled]="!createForm.valid">Vytvořit</button>
      			<button  md-raised-button color="primary" md-dialog-close type = "button">Zrušit</button>
                </div>
      		</md-dialog-content>
        </form>
    `,
    providers: []
})
/**dialog that provides input parameters for new talbe elemet such as row height width and number of rows and columns**/
export class CreateTableModal  {

    //form structure with default values displayed
	public createForm = this.fb.group({
        rows: [5, Validators.required],
        columns: [5,Validators.required],
        rowHeight: [TableElement.default_row_height, Validators.required],
        columnWidth: [TableElement.default_cell_width, Validators.required]
    });

    /**
    @param 'fb' * form builder service from form module used to create and validate displayed form
    **/
	constructor(private fb: FormBuilder, private ref: MdDialogRef<CreateTableModal>){}

    //triggered when form is submited
	onFormSubmited(){
        if(this.createForm.valid){
		    this.ref.close(this.createForm.value)
        }
	}
     
}