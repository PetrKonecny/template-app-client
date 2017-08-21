import { Component, Input, EventEmitter,Output, OnInit} from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { AppConfig } from '../app.config'
import { UploadComponent} from '../uploader.component'

@Component({
    selector: 'upload',
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
    `,
    styles: [`
      .fileContainer {
          overflow: hidden;
          position: relative;
          width:100%;
          height: 80%;
          border: 2px dashed;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
      }

      md-dialog-content{
        display: flex;  
        height: 100%;
        width: 100%;
        justify-content: center;
      }

      .fileContainer [type=file] {
          cursor: inherit;
          display: block;
          font-size: 999px;
          filter: alpha(opacity=0);
          min-height: 100%;
          min-width: 100%;
          opacity: 0;
          position: absolute;
          right: 0;
          text-align: right;
          top: 0;
      }

      .fileContainer [type=file] {
          cursor: pointer;
      }
      
    `]
})

export class ImageUploadComponent {

    @Input()
    uploadUrl: string

    @Output()
    onCompleteAll = new EventEmitter
      
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