import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { ImageService } from '../image/image.service';
import { Element, ElementCommands } from './element';
import { FormBuilder, Validators, FormControl, FormGroup} from '@angular/forms';

@Component({
    selector: 'position-form',
    template: ` 
        	<form class="form" [formGroup]="positionForm" (ngSubmit)="onSaveButtonClicked()">
            <md-input-container>
                <input mdInput type="number" [value]="dimensions.width" formControlName="width" placeholder="width">
            </md-input-container>
            <md-input-container>
                <input  mdInput type="number" [value]="dimensions.height" formControlName="height" placeholder="height">
            </md-input-container>
            <md-input-container>
                <input mdInput type="number" [value]="dimensions.left" formControlName="left"  placeholder="X">
            </md-input-container>
            <md-input-container>
                <input mdInput type="number" [value]="dimensions.top" formControlName="top"  placeholder="Y">
            </md-input-container>
            <button md-button>Nastavit</button>
            </form>
             `,
    styles: [`
        .form{
            display: flex; flex-direction: column; padding: 16px;
        }
    `]
})

export class PositionForm  implements OnInit{
        
    @Input()
    dimensions 

    @Output()
    onSubmit = new EventEmitter


    public positionForm

    constructor(private fb: FormBuilder, private commands: ElementCommands ){

    }

    ngOnInit(){
		this.positionForm = this.fb.group({
	        width: [this.dimensions.width, Validators.required],
	        height: [this.dimensions.height,Validators.required],
	        left: [this.dimensions.left, Validators.required],
	        top: [this.dimensions.top, Validators.required],
    	});    
    }
    

    onSaveButtonClicked(){
    	if(this.positionForm.valid){
    		this.onSubmit.emit(this.positionForm.value)
    	}
    }
}