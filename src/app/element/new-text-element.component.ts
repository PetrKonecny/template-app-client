import { Component, ElementRef, Input, ViewChild, AfterViewInit, DoCheck, KeyValueDiffers, KeyValueDiffer, HostListener} from '@angular/core';
import { Element, ElementCommands} from './element';
import { TextElement} from './text-element'
import { Font} from '../font/font'
import { ElementDimensions } from '../resizable.directive'
import { NewPageRemote } from '../page/new-page.remote'
import { ElementStore } from '../element/element.store'

@Component({
    selector: 'create-new-text-element',
    template: `
        <div class="new-text-element" draggable2 [class.selected]="selected" [style.opacity]="element.opacity ? element.opacity/100 : 1" (move) ="move($event)" #container [style.background] = "element.background_color ? element.background_color : 'none'" [style.color]="element.text_color ? element.text_color : defaultTextColor" [style.width.px]="element.width" [style.height.px]="element.height" [style.top.px]="element.positionY" [style.left.px]="element.positionX" class= "inner" >\            
            <span #textContainer ><display-content *ngIf="element.content" [content] = "element.content"></display-content></span>
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
})

export class NewTextElementComponent  {
    
    @Input()
    element : TextElement    
    
    defaultTextColor = TextElement.defaultTextColor
    defaultBackgroundColor = Element.defaultBackgroundColor
    selected: boolean

    /**
    @param elementStore - injects reference to the selected element
    @param newPage - injects reference to the current page
    @param coomands - injects commands to malipulate the eleemnt
    */
    constructor(
        private elementStore: ElementStore,
        private newPage: NewPageRemote,
        private commands: ElementCommands
    ){
        this.elementStore.element.subscribe(element =>this.selected = this.element === element)
    }
    
    //called as an utput of draggable directive
    move(dimensions: ElementDimensions){
        let d = this.newPage.move(this.element,dimensions)
        if(d){
            this.commands.startMovingElement(this.element,d)
        }
    }
}