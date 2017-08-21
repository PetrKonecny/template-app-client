import { Component, Input} from '@angular/core'
import { Observable }     from 'rxjs/Observable'
import { FormBuilder, Validators, FormControl} from '@angular/forms'
import {MdDialogRef} from '@angular/material'
import { Album } from '../album/album'

@Component({
    selector: 'album-save-modal',
    template: `
        <form [formGroup]="saveForm" (ngSubmit)="onSaveButtonClicked()">
                <h2 md-dialog-title>{{title}}</h2>
                <md-dialog-content>
                    <div>
                    <md-input-container style="width: 100%;">
                        <input mdInput formControlName="name" type="text" placeholder="Název alba">
                    </md-input-container>
                    </div>
                    <div>
                     <tag-input [secondaryPlaceholder]="'Přidejte tagy'" [identifyBy]="'id'" [displayBy]="'tag_name'" formControlName="tagged">
                      </tag-input>
                    </div>
                    <br>
                    <div>
                        <md-radio-group formControlName="public">
                        <md-radio-button [value]="0">Album vidíte jen vy </md-radio-button>
                        <br>
                        <md-radio-button [value]="1">Album je viditelné všem </md-radio-button>
                        </md-radio-group>
                        </div>
                    <hr>
                </md-dialog-content>
                <md-dialog-actions>
                    <div>
                    <button  md-raised-button color="primary" type = "submit" [disabled]="!saveForm.valid">Uložit</button>
                    </div>
                    <div>
                    <button  md-raised-button color="primary" md-dialog-close type = "button">Zrušit</button>
                    </div>
                </md-dialog-actions>
        </form>
    `,
    providers: []
})

//displays dialog to create or edit new album
export class SaveAlbumModal  {
    
    @Input()
    ///album to create or edit
    album: Album
    title:string = "Album"

    public saveForm = this.fb.group({
        name: [, Validators.required],
        public: [1],
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