import { Component, ElementRef, Input, ViewChild, AfterViewInit, DoCheck, KeyValueDiffers, KeyValueDiffer, HostListener} from '@angular/core';
import { Element, ElementCommands} from './element';
import { TextElement} from './text-element'
import { Font} from '../font/font'
import { NewPageReference } from '../page/new-page.ref'
import { ElementStore } from '../element/element.store'
import { ElementDimensions} from '../draggable.directive'

@Component({
    selector: 'create-new-text-element',
    template: `
        <div class="new-text-element" #wrapper draggable2 [class.selected]="selected" [style.opacity]="element.opacity ? element.opacity/100 : 1" (move) ="move($event)" #container [style.background] = "element.background_color ? element.background_color : 'none'" [style.color]="element.text_color ? element.text_color : defaultTextColor" [style.width.px]="element.width" [style.height.px]="element.height" [style.top.px]="element.positionY" [style.left.px]="element.positionX" class= "inner" >\            
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

    @ViewChild('wrapper')
    wrapper: any
    
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
        private newPage: NewPageReference,
        private commands: ElementCommands
    ){
        this.elementStore.element.subscribe(element =>this.selected = this.element === element)
    }
    
    //called as an utput of draggable directive
    move(dimensions: ElementDimensions){
        let d = this.newPage.move(this.element,dimensions)
        if(d){
            //let x = this.wrapper.nativeElement.style.left.slice(0,-2) 
            //console.log(+x+d.left+'px',this.wrapper.nativeElement.style.left)
            //this.wrapper.nativeElement.style.left = +x + d.left + 'px'
            this.commands.startMovingElement(this.element,d)
        }
    }
}