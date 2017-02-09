import { Component, Input, ViewChild, ElementRef, AfterViewInit} from '@angular/core';
import { Element} from './element';
import { Image } from '../image/image';
import { ImageSelector } from '../image/image-selector';
import { ImageContent } from '../content/image-content';
import { TextElement} from './text-element'
import { ElementSelector } from '../element/element-selector';

@Component({
    selector: 'display-text-element',
    template: `
        <div [style.background-color]="getBgColor()" [style.width.px]="element.width" [style.height.px]="element.height" [style.left.px] = "element.positionX" [style.top.px] = "element.positionY">
            <display-content *ngIf="element.content" [content] = "element.content"></display-content>
        </div>      
    `,
    styles:[`
        div {
            position: absolute;
        }
    `] 
})

export class DisplayTextElementComponent {

    @Input()
    element: TextElement;

    private getBgColor(){
        let color = this.element.background_color
        if(color){
            return color
        }else{
            return Element.defaultBackgroundColor
        }
    }
 
}