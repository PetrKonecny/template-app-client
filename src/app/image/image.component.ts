import { Component, OnInit, Input, OnChanges, EventEmitter, Output, ElementRef, ViewChild} from '@angular/core';
import {Image} from '../image/image'
import { AppConfig } from '../app.config'

@Component({
    selector: 'image',
    template: `
            <div class="shutter">
                <md-spinner class="spinner" *ngIf="loading && !error"></md-spinner>
                <md-icon *ngIf="error">error</md-icon>
            </div>
            <img #img class="image" [hidden]="loading || error" (load)="onLoad()" (error)="onError()" src="{{getSrc()}}"  [class.image-selected]="image.selected" draggable="true" (dragstart)="onDragStart($event,image)">
             `,
    providers: [],
    styles: [`img {width: 100%; height: 100%;} `],
})

//displays image with loading indicator
export class ImageComponent implements OnChanges{
       
    @Input()
    //image to be displayed
    image: Image

    @Input()
    //whether it is thumbnail or not
    thumb: boolean

    @Output()
    //triggered when the image is loaded
    loaded = new EventEmitter

    @Output()
    //triggered if there is error loading the image
    loadingError = new EventEmitter

    @ViewChild('img')
    //reference to the img element in the template
    img: ElementRef

    //loading indicator
    loading: boolean = true
    //error flag
    error: boolean = false  
    
    /**
    @param config - config used to get API url
    */
    constructor( private config: AppConfig){
    }

    ngOnChanges(){
        this.loading = true
        this.error = false
    }

    //gets propper image route
    getSrc(){
        let src = this.config.getConfig('api-url')+'/img/'+this.image.image_key+'.'+this.image.extension
        if(this.thumb && this.image.extension !== 'svg'){
            src += "?w=250&h=250&fit=crop"
        }
        return src
    }
    
    //triggered when image is loaded
    onLoad(){
        this.loading = false
        this.image.originalHeight = this.img.nativeElement.naturalHeight
        this.image.originalWidth = this.img.nativeElement.naturalWidth
        this.loaded.emit(this.image)
    }

    //triggered when the drag is started
    onDragStart(event, image){
        event.dataTransfer.setData("type","IMAGE_ELEMENT")
        event.dataTransfer.setData("data",JSON.stringify(image))
    }

    //triggered when there is error while loading the image
    onError(){
        this.error = true
        this.loadingError.emit()
    }
    
}