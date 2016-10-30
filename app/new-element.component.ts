import { Component, ElementRef, Input, ViewChild, AfterViewInit, OnChanges} from '@angular/core';
//import { NgGrid, NgGridItem } from 'angular2-grid';
import { Element} from './element';
import { ElementSelector, FontRefreshable } from './element-selector'
import { Draggable} from './draggable.directive'
import { TextElement} from './text-element'
import { DisplayContentComponent } from './display-content.component';
import { ImageSelector, ImageRefreshable} from './image-selector';
import { ImageContent } from './image-content';
import {Image} from './image'
import {Font} from './font'
import { DisplayContentImgDragComponent } from './display-content-img-drag.component';

@Component({
    selector: 'create-new-element',
    template: `
        <div *ngIf="draggable" draggable #frame (click)="onElementClicked()" class= "inner" [style.font-size.px]="element.font_size" [style.width.px]="element.width" [style.height.px]="element.height" [style.left.px] = "element.positionX" [style.top.px] = "element.positionY">
                <span [ngSwitch]=element.type>
                    <span *ngSwitchCase="'text_element'">
                        <span #textContainer ><display-content *ngIf="element.content" [content] = "element.content"></display-content></span>
                    </span>
                    <span *ngSwitchCase="'image_element'">
                        <display-content *ngIf="element.content" [content] = "element.content"></display-content>
                        <button *ngIf="element.content && !element.content.image" style="top: 20px" class="button" (click)="onAddButtonClick()" >Add image</button>
                        <button *ngIf="element.content && element.content.image" style="top: 40px" class="button" (click)="onDeleteButtonClick()" class="button">Delete image</button>
                        <button *ngIf="element.content && element.content.image && draggable" style="top: 60px" class="button" (click)="onAdjustButtonClick()" class="button">Adjust image</button>
                    </span>
                </span>
        </div>

        <div *ngIf="!draggable" (click)="onElementClicked()" class= "inner" [style.font-size.px]="element.font_size" [style.width.px]="element.width" [style.height.px]="element.height" [style.left.px] = "element.positionX" [style.top.px] = "element.positionY">
                <span [ngSwitch]=element.type>
                    <span *ngSwitchCase="'text_element'">
                        <span #textContainer><display-content *ngIf="element.content" [content] = "element.content"></display-content></span>
                    </span>
                    <span *ngSwitchCase="'image_element'">
                        <display-content-img-drag *ngIf="element.content" [content] = "element.content"></display-content-img-drag>
                        <button *ngIf="element.content.image" style="top: 40px" class="button"  (click)="onPlusButtonClick()" >Zoom in</button>
                        <button *ngIf="element.content.image" style="top: 60px" class="button"  (click)="onMinusButtonClick()" >Zoom out</button>
                        <button *ngIf="element.content && element.content.image" (click)="onDoneAdjustButtonClick()" class="button">Done adjusting</button>
                    </span>
                </span>
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
    directives: [Draggable, DisplayContentComponent, DisplayContentImgDragComponent]
})

export class NewElementComponent implements AfterViewInit, ImageRefreshable, FontRefreshable, OnChanges {
    
    @Input()
    element : Element
    
    @ViewChild('textContainer')
    textContainer : ElementRef
    
    @ViewChild(DisplayContentComponent)
    displayContent :  DisplayContentComponent
    
    @ViewChild(DisplayContentImgDragComponent)
    displayContentImgDrag :  DisplayContentImgDragComponent
    
    draggable: boolean = true;
    
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
        if (this.element.type == 'text_element'){
            (<TextElement>this.element).font_size = this.styleToNum(this.elementRef.nativeElement.children[0].style.fontSize);
        }
        if (this.displayContent){
            this.displayContent.saveContent();
        }
        if (this.displayContentImgDrag){
            this.displayContentImgDrag.saveContent();
        }
    }
    
    styleToNum(style){
        return Number(style.substring(0, style.length - 2));
    }
    
    ngOnChanges(){
        console.log(this.element);
    }
    
    ngAfterViewInit(){
        console.log(this.element);
        if(this.element.type == 'text_element' &&(<TextElement>this.element).font && (<TextElement>this.element).font.id){
            var newStyle = document.createElement('style');
            newStyle.appendChild(document.createTextNode("\
            @font-face {\
                font-family: '" +"font" + (<TextElement>this.element).font.id + "';\
                src: url('"+"http://localhost:8080/font/"+(<TextElement>this.element).font.id +"/file" +"');\
            }\
            "));
            document.head.appendChild(newStyle);
            this.textContainer.nativeElement.style.fontFamily = "font"+(<TextElement>this.element).font.id;
        }
    }
    
    onElementClicked(){
        this.elementSelector.changeElement(this.element, this);
    }
    
    onAddButtonClick(){
        this.imageSelector.openSelectorWindow(this);
    }
    
    onDeleteButtonClick(){
        (<ImageContent>this.element.content).image = null;
    }
    
    onPlusButtonClick(){
        this.displayContentImgDrag.zoomIn()    
    }
    
    onMinusButtonClick(){
        this.displayContentImgDrag.zoomOut()    
    }
    
    onDoneAdjustButtonClick(){
        this.fillFromDOM();
        this.draggable = true;
    }
    
    onAdjustButtonClick(){
        this.fillFromDOM();
        this.draggable = false;
    }
    
    refreshImage(image: Image){
        (<ImageContent>this.element.content).image = image;
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