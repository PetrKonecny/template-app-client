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

export class SaveAlbumModal  {
    
    @Input()
    album: Album

    public saveForm = this.fb.group({
        name: [, Validators.required],
        public: [false],
        tagged: [""]
    });

    constructor(private fb: FormBuilder, private ref: MdDialogRef<SaveAlbumModal>){

    }

    setAlbum(album: Album){
        this.saveForm.patchValue(album)
    }

    onSaveButtonClicked(){
        if(this.saveForm.valid){
            this.ref.close(this.saveForm.value)
        }
    }
     
}