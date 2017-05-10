import { Component, Input, ElementRef } from '@angular/core';
import { ImageElement } from './image-element'
import { AppConfig } from '../app.config'

@Component({
    selector: 'display-image-element',
    template: `
        <div  [style.opacity]="element.opacity ? element.opacity/100 : 1" [class.selected]="selected" [style.top.px]="element.positionY" [style.left.px]="element.positionX" [style.width.px]="element.width" [style.height.px]="element.height">
            <image *ngIf="element?.image" [image]="element.image"></image>          
        </div>                 
    `,
    styles: [
        `div{
            position: absolute;
        }


        `
    ]
})

//displays image element in document editor pages      
export class DisplayImageElementComponent {
    
    @Input()
    element : ImageElement
    selected: boolean
     
    constructor(private image: ElementRef, private config: AppConfig){
    }
    
    ngDoCheck(){
        /*
        if((!this.element.width || !this.element.height) && this.image ){
            this.element.width = this.image.nativeElement.naturalWidth
            this.element.height = this.image.nativeElement.naturalHeight
        }*/
    }     
}