import { Component, ElementRef, Input, ViewChild, AfterViewInit, OnChanges} from '@angular/core';
//import { NgGrid, NgGridItem } from 'angular2-grid';
import { Element} from './element';
import { ImageElement } from './image-element'
import { ElementSelector} from './element-selector'
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
    selector: 'create-new-image-element',
    template: `
        <div *ngIf="draggable" draggable #frame (click)="onElementClicked()" class= "inner" [style.font-size.px]="element.font_size" [style.width.px]="element.width" [style.height.px]="element.height" [style.left.px] = "element.positionX" [style.top.px] = "element.positionY">
            <display-content *ngIf="element.content" [content] = "element.content"></display-content>
            <button *ngIf="element.content && !element.content.image" style="top: 20px" class="button" (click)="onAddButtonClick()" >Add image</button>
            <button *ngIf="element.content && element.content.image" style="top: 40px" class="button" (click)="onDeleteButtonClick()" class="button">Delete image</button>
            <button *ngIf="element.content && element.content.image && draggable" style="top: 60px" class="button" (click)="onAdjustButtonClick()" class="button">Adjust image</button>
        </div>

        <div *ngIf="!draggable" (click)="onElementClicked()" class= "inner" [style.font-size.px]="element.font_size" [style.width.px]="element.width" [style.height.px]="element.height" [style.left.px] = "element.positionX" [style.top.px] = "element.positionY">
            <display-content-img-drag *ngIf="element.content" [content] = "element.content"></display-content-img-drag>
            <button *ngIf="element.content.image" style="top: 40px" class="button"  (click)="onPlusButtonClick()" >Zoom in</button>
            <button *ngIf="element.content.image" style="top: 60px" class="button"  (click)="onMinusButtonClick()" >Zoom out</button>
            <button *ngIf="element.content && element.content.image" (click)="onDoneAdjustButtonClick()" class="button">Done adjusting</button>
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

export class NewImageElementComponent {
    
    @Input()
    element : ImageElement
    
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
}