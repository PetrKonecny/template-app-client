import { Component, Input, EventEmitter,Output, OnInit} from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { AppConfig } from '../app.config'
import { ImageUploadComponent } from '../image/image-uploader.component'

@Component({
    selector: 'inframe-image-upload',
    template: `
          <label *ngIf="!uploader.getNotUploadedItems().length" class="fileContainer">
            <input type="file" ng2FileSelect [uploader]="uploader" single  />
          </label>
        `   
})
export class InframeImageUploaderComponent  extends ImageUploadComponent{

}