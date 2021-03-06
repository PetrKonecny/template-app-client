import { Component, Input, EventEmitter,Output, OnInit} from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { AppConfig } from '../app.config'
import { UploadComponent} from '../uploader.component'

@Component({
    selector: 'image-upload',
    template: `
          <h2 md-dialog-title>Nahrát obrázky</h2>
          <label *ngIf="!uploader.getNotUploadedItems().length" class="fileContainer">
            <b>Vyberte obrázky přetažením nebo kliknutím</b>
            <input type="file" ng2FileSelect [uploader]="uploader" multiple  />
          </label>
          <div *ngIf="uploader.getNotUploadedItems().length" class="fileContainer">
             <h4>Nahrávají se obrázky</h4>
             <md-progress-spinner [value]="uploader.progress"></md-progress-spinner>
             <h4>{{uploader.progress}}%</h4>
          </div>
    `
})

export class ImageUploadComponent {

    @Input()
    uploadUrl: string

    @Output()
    onCompleteAll = new EventEmitter

    @Output()
    onComplete = new EventEmitter

    @Output()
    onProgress = new EventEmitter
      
    public uploader:FileUploader 

    public hasBaseDropZoneOver:boolean = false;
    public hasAnotherDropZoneOver:boolean = false;

    constructor(private config: AppConfig){
      
    }

    ngOnInit(){
      this.uploader = new FileUploader({url: this.uploadUrl})
      this.uploader.onCompleteAll =  () => {
        this.onCompleteAll.emit()
      }
      this.uploader.onCompleteItem = (item,response,status,headers) => {
        this.onComplete.emit(response)
      }
      this.uploader.onProgressAll = (value) => {
        this.onProgress.emit(value)
      }
      this.uploader.onAfterAddingAll = () => {
        this.uploader.uploadAll()
      }
    }

    public fileOverBase(e:any):void {
      this.hasBaseDropZoneOver = e;
    }
 
    public fileOverAnother(e:any):void {
      this.hasAnotherDropZoneOver = e;
    }

}