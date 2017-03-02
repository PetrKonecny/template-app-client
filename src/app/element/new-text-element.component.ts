import { Component, ElementRef, Input, ViewChild, AfterViewInit, DoCheck, KeyValueDiffers, KeyValueDiffer, HostListener} from '@angular/core';
import { Element, ElementRedoer} from './element';
import { ElementSelector } from './element-selector'
import { TextElement} from './text-element'
import { Font} from '../font/font'
import { ElementDimensions } from '../resizable.directive'
import { NewPageRemote } from '../page/new-page.remote'
import {BasicStep, CompositeStep, StepSelector, StateChangeRespond} from '../step-selector'

@Component({
    selector: 'create-new-text-element',
    template: `
        <div draggable2 [class.selected]="selected" (move) ="move($event)" #container [style.background] = "element.background_color ? element.background_color : 'none'" [style.color]="element.text_color ? element.text_color : defaultTextColor" [style.width.px]="element.width" [style.height.px]="element.height" [style.top.px]="element.positionY" [style.left.px]="element.positionX" class= "inner" >\            
            <span #textContainer ><display-content *ngIf="element.content" [content] = "element.content"></display-content></span>
        </div>
    `,
    styles:[`
        .inner {
            overflow: hidden;   
            border: 1px dashed grey;      
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
    
    @ViewChild('textContainer')
    textContainer : ElementRef
    
    @ViewChild('container')
    container : ElementRef
          
    defaultTextColor = TextElement.defaultTextColor
    defaultBackgroundColor = Element.defaultBackgroundColor
    selected: boolean

    constructor(
        public elementRef: ElementRef, 
        private elementSelector: ElementSelector,
        private newPage: NewPageRemote,
        private stateService: StepSelector,
        private redoer: ElementRedoer
    ){
        this.elementSelector.element.subscribe(element =>this.selected = this.element == element)
    }
    
    move(dimensions: ElementDimensions){
        let d = this.newPage.move(this.element,dimensions)
        if(d){
            this.redoer.startMovingElement(this.element,d)
        }
    }
    
    refreshFont(font: Font){
        if(!font || !font.id) return
        this.textContainer.nativeElement.style.fontFamily = "font"+(<TextElement>this.element).font.id;
    }
    
    changeFontSize(size: number){
        if(size <= 0) return
        this.textContainer.nativeElement.style.fontSize = size
    }    
    changeTextAlign(align: string){
        if(!align) return
        this.textContainer.nativeElement.style.textAlign = align
    }
    
    changeTextAlignVertical(align: string){
        this.textContainer.nativeElement.style.display = "inline-block"
        this.textContainer.nativeElement.style.verticalAlign = align
    }
}