import { Component, ElementRef, Input, ViewChild, AfterViewInit, OnChanges} from '@angular/core';
//import { NgGrid, NgGridItem } from 'angular2-grid';
import { Element} from './element';
import { ElementSelector } from './element-selector'
import { Draggable} from './draggable.directive'
import { TextElement} from './text-element'
import { DisplayContentComponent } from './display-content.component';
import { ImageSelector, ImageRefreshable} from './image-selector';
import { ImageContent } from './image-content';
import {Image} from './image'
import {Font} from './font'
import { DisplayContentImgDragComponent } from './display-content-img-drag.component';
import { NewElementComponent} from './new-element.component'

@Component({
    selector: 'create-new-text-element',
    template: `
        <div draggable (click)="onElementClicked()" class= "inner" [style.font-size.px]="element.font_size" [style.width.px]="element.width" [style.height.px]="element.height" [style.left.px] = "element.positionX" [style.top.px] = "element.positionY">
            <span #textContainer ><display-content *ngIf="element.content" [content] = "element.content"></display-content></span>                       
        </div>
    `,
    styles:[`
        .inner {
            position: absolute;
            overflow: hidden;         
            background-color: rgba(0, 0, 0, 0.25);
        }
        .button{
            z-index: 1000;
            position: absolute;
            margin-right: 10px;
        }
    `],
    directives: [Draggable, DisplayContentComponent]
})

export class NewTextElementComponent implements AfterViewInit {
    
    @Input()
    element : TextElement
    
    @ViewChild('textContainer')
    textContainer : ElementRef
    
    @ViewChild(DisplayContentComponent)
    displayContent :  DisplayContentComponent
      
    constructor(
        public elementRef: ElementRef, 
        private elementSelector: ElementSelector,
        private imageSelector: ImageSelector
    ){}
    
    fillFromDOM(){
        this.element.height = this.elementRef.nativeElement.children[0].offsetHeight;
        this.element.width = this.elementRef.nativeElement.children[0].offsetWidth;
        this.element.positionX = this.elementRef.nativeElement.children[0].offsetLeft;
        this.element.positionY = this.elementRef.nativeElement.children[0].offsetTop;
        
        this.element.font_size = this.styleToNum(this.elementRef.nativeElement.children[0].style.fontSize);
        if (this.displayContent){
            this.displayContent.saveContent();
        }      
    }
    
    styleToNum(style){
        return Number(style.substring(0, style.length - 2));
    }
    
    ngAfterViewInit(){
        console.log(this.element);
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
    
    onElementClicked(){
        this.elementSelector.changeElement(this.element, this);
    } 
    
    refreshFont(font: Font){
        this.textContainer.nativeElement.style.fontFamily = "font"+(<TextElement>this.element).font.id;
    }
    
    changeTextAlign(align: string){
        this.textContainer.nativeElement.style.textAlign = align
    }
    
    changeTextAlignVertical(align: string){
        this.textContainer.nativeElement.style.display = "inline-block"
        this.textContainer.nativeElement.style.verticalAlign = align
    }
 
}