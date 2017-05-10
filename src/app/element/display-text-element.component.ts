import { Component, Input} from '@angular/core';
import { Element} from './element';
import { TextElement} from './text-element'

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

//displays text element in document editor pages
export class DisplayTextElementComponent {

    @Input()
    //text element to be displayed
    element: TextElement;

    //shorthand to get background color
    private getBgColor(){
        let color = this.element.background_color
        if(color){
            return color
        }else{
            return Element.defaultBackgroundColor
        }
    }
 
}