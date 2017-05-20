import { Component, Input} from '@angular/core'
import { Observable }     from 'rxjs/Observable'
import { FormBuilder, Validators } from '@angular/forms'
import {MdDialogRef} from '@angular/material'
import { Album } from '../album/album'

@Component({
    selector: 'album-save-modal',
    template: `
        <form [formGroup]="saveForm" (ngSubmit)="onSaveButtonClicked()">
                <h2 md-dialog-title>ALBUM</h2>
                <hr>
                <md-dialog-content>
                    <div>
                    <md-input-container style="width: 100%;">
                        <input mdInput formControlName="name" type="text" placeholder="název alba">
                        <md-hint *ngIf="saveForm.controls['name'].hasError('required') && saveForm.controls['name'].touched"  style="color:red;">nutné vyplnit název</md-hint>                    
                    </md-input-container>
                    </div>
                    <div>
                     <tag-input [identifyBy]="'id'" [displayBy]="'tag_name'" formControlName="tagged">
                      </tag-input>
                    </div>
                    <br>
                    <div>
                    <md-checkbox formControlName="public">Veřejné</md-checkbox>
                    </div>
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

//displays dialog to create or edit new album
export class SaveAlbumModal  {
    
    @Input()
    ///album to create or edit
    album: Album

    public saveForm = this.fb.group({
        name: [, Validators.required],
        public: [false],
        tagged: [""]
    });

    /**
    @param fb - form builder that creates the form
    @param ref - reference to the dialog 
    */
    constructor(private fb: FormBuilder, private ref: MdDialogRef<SaveAlbumModal>){

    }

    //sets album values into the form
    setAlbum(album: Album){
        this.saveForm.patchValue(album)
    }

    //triggered when form is submitted
    onSaveButtonClicked(){
        if(this.saveForm.valid){
            this.ref.close(this.saveForm.value)
        }
    }
     
}