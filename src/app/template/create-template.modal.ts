import { Component, Input, ViewChild,ElementRef} from '@angular/core';
import { Observable }     from 'rxjs/Observable';
import { FormBuilder, Validators, FormControl, FormGroup} from '@angular/forms';
import {MdDialogRef} from '@angular/material'

@Component({
    selector: 'create-table-modal',
    template: `
        <form [formGroup]="createForm" (ngSubmit)="onSaveButtonClicked()">
        		<h2 md-dialog-title>VYTVOŘIT ŠABLONU</h2>
                <hr>
        		<md-dialog-content>
                    <div>
                        <div>
                			<md-radio-group formControlName="type">
                         <b>Rozměry: </b>
                                <md-radio-button value="A5">A5</md-radio-button>
                                <md-radio-button value="A4">A4</md-radio-button>
                                <md-radio-button value="A3">A3</md-radio-button>
                                <md-radio-button value="custom" #custom >Vlastní</md-radio-button>
                            </md-radio-group>
                        </div>
                        <div [hidden]="custom.checked">
                            <br>
                            <b>Orientace: </b><md-radio-group formControlName="orientation">
                                <md-radio-button value="0">Na výšku</md-radio-button>
                                <md-radio-button value="1">Na šířku</md-radio-button>
                            </md-radio-group>
                        </div>
                        <div [hidden]="!custom.checked">
                            <br>
                            <md-input-container style="width: 100%;">
                                <input formControlName="height" mdInput type="number" placeholder="výška stránky (mm)">
                            </md-input-container>
                            <md-input-container style="width: 100%;">
                                <input formControlName="width" mdInput type="number" placeholder="šířka stránky (mm)">
                            </md-input-container>
                        </div>
                    </div>
                    <hr>
                    <div style="float: right;">
              			<button  md-raised-button color="primary" type = "submit" [disabled]="!createForm.valid">Vytvořit</button>
              			<button  md-raised-button color="primary" md-dialog-close type = "button">Zrušit</button>
                    </div>
          		</md-dialog-content>
        </form>
    `,
    providers: []
})

export class CreateTemplateModal  {

    @ViewChild('custom')
    custom

	public createForm = this.fb.group({
        type: ["A4", Validators.required],
        orientation: ["0",Validators.required],
        width: [],
        height: [],
    },{validator: this.dimensionsValid});

	constructor(private fb: FormBuilder, private ref: MdDialogRef<CreateTemplateModal>){}

	onSaveButtonClicked(){
        if(this.createForm.valid){
		    this.ref.close(this.createForm.value)
        }
	}

    dimensionsValid(group: FormGroup) {
        let custom = group.controls['type'].value == 'custom'
        let width = group.controls['height'].value
        let height = group.controls['width'].value
        if (custom && (!width || !height || width < 100 || height < 100 || width > 2000 || height > 2000)) {
          return {
              dimensionsValid: {valid: false}
          };
        }
    }
       
}