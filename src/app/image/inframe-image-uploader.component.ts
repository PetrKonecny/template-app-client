import { Component, Input, EventEmitter,Output, OnInit} from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { AppConfig } from '../app.config'
import { ImageUploadComponent } from '../image/image-uploader.component'

@Component({
    selector: 'inframe-image-upload',
    template: `
          <label *ngIf="!uploader.getNotUploadedItems().length" class="fileContainer">
            <input type="file" ng2FileSelect [uploader]="uploader" single  />
  			<md-icon>file_upload</md-icon>
  			<div style="text-align: center; padding-top: 10px;">Nahrejte obrázek přetažením nebo kliknutím</div>
          </label>
        `   
})
export class InframeImageUploaderComponent  extends ImageUploadComponent{

}