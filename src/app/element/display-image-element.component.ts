import { Component, Input, ElementRef } from '@angular/core';
import { ImageElement } from './image-element'
import { NewPageRemote } from '../page/new-page.remote'
import { ElementDimensions } from '../resizable.directive'
import { ElementSelector } from './element-selector'
import { AppConfig } from '../app.config'

@Component({
    selector: 'display-image-element',
    template: `
        <img (resize) ="resize($event)" [style.top.px]="element.positionY" [style.left.px]="element.positionX" [width]="element.width" [height]="element.height" src="{{config.getConfig('api-url')}}/img/{{element.image.image_key}}.{{element.image.extension}}">          
    `,
    styles: [
        `img{
            position: absolute;
        }


        `
    ]
})

       
export class DisplayImageElementComponent {
    
    @Input()
    element : ImageElement
    selected: boolean
     
    constructor(private image: ElementRef, private config: AppConfig){
    }
    
    ngDoCheck(){
        if((!this.element.width || !this.element.height) && this.image ){
            this.element.width = this.image.nativeElement.naturalWidth
            this.element.height = this.image.nativeElement.naturalHeight
        }
    }     
}