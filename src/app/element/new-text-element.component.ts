import { Component, Input, ViewChild, ChangeDetectionStrategy} from '@angular/core';
import { Element } from './element';
import { TextElement} from './text-element'
import { NewElementComponent } from '../element/new-element.component'

@Component({
    selector: 'create-new-text-element',
    template: `
        <div class="new-text-element" #wrapper draggable2 [class.selected]="selected" [style.opacity]="element.opacity ? element.opacity/100 : 1" (move) ="move($event)" #container [style.background] = "element.background_color ? element.background_color : 'none'" [style.color]="element.text_color ? element.text_color : defaultTextColor" [style.width.px]="element.width" [style.height.px]="element.height" [style.top.px]="element.positionY" [style.left.px]="element.positionX" class= "inner" >\            
            <span #textContainer ><display-content *ngIf="element.content > 0" [content] = "contents[element.content]"></display-content></span>
        </div>
    `,
    styles:[`
        .inner {
            overflow: hidden;   
            border: 2px dashed grey;      
        }
        .button{
            z-index: 1000;
            position: absolute;
            margin-right: 10px;
        }
    `],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class NewTextElementComponent extends NewElementComponent  {
    
    @Input()
    element : TextElement  
    
    defaultTextColor = TextElement.defaultTextColor
    
    defaultBackgroundColor = Element.defaultBackgroundColor
}