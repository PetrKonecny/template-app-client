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
            <img #img [hidden]="loading || error" (load)="onLoad()" (error)="onError()" src="{{getSrc()}}"  draggable="true" (dragstart)="onDragStart($event,image)">
             `,
    providers: [],
    styles: [`img {width: 100%; height: 100%;} `],
})

export class ImageComponent implements OnChanges{
       
    @Input()
    image: Image

    @Input()
    thumb: boolean

    @Output()
    loaded = new EventEmitter

    @Output()
    loadingError = new EventEmitter

    @ViewChild('img')
    img: ElementRef

    loading: boolean = true
    error: boolean = false  
    
    constructor( private config: AppConfig){
    }

    ngOnChanges(){
        this.loading = true
        this.error = false
    }

    getSrc(){
        let src = this.config.getConfig('api-url')+'/img/'+this.image.image_key+'.'+this.image.extension
        if(this.thumb && this.image.extension !== 'svg'){
            src += "?w=250&h=250&fit=crop"
        }
        return src
    }
    
    onLoad(){
        this.loading = false
        this.image.originalHeight = this.img.nativeElement.naturalHeight
        this.image.originalWidth = this.img.nativeElement.naturalWidth
        console.log(this.image)
        this.loaded.emit(this.image)
    }

    onDragStart(event, image){
        event.dataTransfer.setData("text",JSON.stringify(image))
    }

    onError(){
        this.error = true
        this.loadingError.emit()
    }
    
}