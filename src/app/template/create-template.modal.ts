import { Component, Input, ViewChild,ElementRef} from '@angular/core';
import { Observable }     from 'rxjs/Observable';
import { FormBuilder, Validators, FormControl, FormGroup} from '@angular/forms';
import {MdDialogRef} from '@angular/material'

@Component({
    selector: 'create-template-modal',
    template: `
        <form [formGroup]="createForm" (ngSubmit)="onSaveButtonClicked()">
        		<h2 md-dialog-title>{{title}}</h2>
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
                        <md-input-container style="width: 100%;">
                                <input formControlName="margin" mdInput type="number" placeholder="okraje stránky (px)">
                        </md-input-container>
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

//dialog for creating template, containing necessary forms
export class CreateTemplateModal  {

    @ViewChild('custom')
    //reference to the switch for custom or preset dimensions
    custom

    @Input()
    title = "TITLE"


	public createForm = this.fb.group({
        type: ["A4", Validators.required],
        orientation: ["0",Validators.required],
        width: [],
        height: [],
        margin: [0]
    },{validator: this.dimensionsValid});

    /**
    @param fb - injects formBuider used to create the forms
    @param ref - injects reference to the dialog to be able to close it
    */
	constructor(private fb: FormBuilder, private ref: MdDialogRef<CreateTemplateModal>){}

    //triggered on the form submit
	onSaveButtonClicked(){
        if(this.createForm.valid){
		    this.ref.close(this.createForm.value)
        }
	}

    //checks if whem custom dimensions are set this dimensions are valid
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