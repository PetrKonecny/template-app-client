import { Component, ElementRef, Input, ViewChild, AfterViewInit, DoCheck, KeyValueDiffers, KeyValueDiffer} from '@angular/core';
import { Element} from './element';
import { ElementSelector } from './element-selector'
import { TextElement} from './text-element'
import { Font} from '../font/font'
import { ElementDimensions } from '../resizable.directive'
import { NewPage } from '../page/new-page'

@Component({
    selector: 'create-new-text-element',
    template: `
        <div draggable2 resizable  (resize) ="resize($event)" (move) ="move($event)" (outOfBounds)="outOfBounds($event)" #container (click)="onElementClicked()" [style.background-color] = "element.background_color ? element.background_color : defaultBackgroundColor" [style.color]="element.text_color ? element.text_color : defaultTextColor" [style.width.px]="element.width" [style.height.px]="element.height" [style.top.px]="element.positionY" [style.left.px]="element.positionX" class= "inner" >
            <span #textContainer ><display-content *ngIf="element.content" [content] = "element.content"></display-content></span>                       
        </div>
    `,
    styles:[`
        .inner {
            position: absolute;
            overflow: hidden;         
        }
        .button{
            z-index: 1000;
            position: absolute;
            margin-right: 10px;
        }
    `],
})

export class NewTextElementComponent implements AfterViewInit, DoCheck {
    
    @Input()
    element : TextElement
    
    @ViewChild('textContainer')
    textContainer : ElementRef
    
    @ViewChild('container')
    container : ElementRef
      
    differ: KeyValueDiffer;
    
    defaultTextColor = TextElement.defaultTextColor
    defaultBackgroundColor = Element.defaultBackgroundColor

    constructor(
        public elementRef: ElementRef, 
        private elementSelector: ElementSelector,
        private newPage: NewPage,
        private differs: KeyValueDiffers
    ){
        this.differ = differs.find({}).create(null);
    }
        
    ngDoCheck(){
        var changes = this.differ.diff(this.element);
        if(changes) {
                changes.forEachChangedItem(r => this.applyInputChanges(r));
                changes.forEachAddedItem(r => this.applyInputChanges(r));
        } 
    }
    
    applyInputChanges(change: any){
        if(change.key == 'font'){
            this.refreshFont(this.element.font);
        }else if(change.key == 'font_size'){
            this.changeFontSize(this.element.font_size)
        }else if(change.key == 'text_align'){
            this.changeTextAlign(this.element.text_align)
        }
    }
    
    styleToNum(style){
        return Number(style.substring(0, style.length - 2));
    }
    
    ngAfterViewInit(){
        if(this.element.font && this.element.font.id){
            var newStyle = document.createElement('style');
            newStyle.appendChild(document.createTextNode("\
            @font-face {\
                font-family: '" +"font" + this.element.font.id + "';\
                src: url('"+"http://localhost:8080/font/"+this.element.font.id +"/file" +"');\
            }\
            "));
            document.head.appendChild(newStyle);
            this.textContainer.nativeElement.style.fontFamily = "font"+this.element.font.id;
        }
    }
    
    resize(dimensions: ElementDimensions){
        this.newPage.resize(this.element,dimensions)
    }
    
    move(dimensions: ElementDimensions){
        this.newPage.move(this.element,dimensions)
    }
    
    outOfBounds(dimensions: ElementDimensions){
        this.element.width = dimensions.width
        this.element.height = dimensions.height
        this.element.positionX = dimensions.left
        this.element.positionY = dimensions.top
    }
    
    onElementClicked(){
        this.elementSelector.changeElement(this.element);
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