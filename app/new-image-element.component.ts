import { Component, ElementRef, Input, ViewChild, AfterViewInit, OnChanges, KeyValueDiffers} from '@angular/core';
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
import { ElementDimensions } from './draggable.directive'
import { Draggable2 } from './draggable2.directive'
import { Resizable } from './resizable.directive'

@Component({
    selector: 'create-new-image-element',
    template: `
        <div #frame *ngIf="draggable" draggable2 resizable (resize) ="resize($event)" (move) ="move($event)" (outOfBounds)="outOfBounds($event)" (click)="onElementClicked()" class= "inner" [style.width.px]="element.width" [style.height.px]="element.height" [style.top.px]="element.positionY" [style.left.px]="element.positionX">
            <display-content *ngIf="element.content" [content] = "element.content"></display-content>
            <button *ngIf="element.content && !element.content.image" style="top: 20px" class="button" (click)="onAddButtonClick()" >Add image</button>
            <button *ngIf="element.content && element.content.image" style="top: 40px" class="button" (click)="onDeleteButtonClick()" class="button">Delete image</button>
            <button *ngIf="element.content && element.content.image && draggable" style="top: 60px" class="button" (click)="onAdjustButtonClick()" class="button">Adjust image</button>
        </div>
        <div #frame *ngIf="!draggable" (click)="onElementClicked()" class= "inner" [style.width.px]="element.width" [style.height.px]="element.height" [style.top.px]="element.positionY" [style.left.px]="element.positionX" >
            <display-content-img-drag [content] = "element.content"></display-content-img-drag>
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
    directives: [Draggable, Resizable, Draggable2, DisplayContentComponent, DisplayContentImgDragComponent]
})

export class NewImageElementComponent {
    
    @Input()
    element : ImageElement
    
    draggable: boolean = true;
        
    constructor(
        public elementRef: ElementRef, 
        private elementSelector: ElementSelector,
        private imageSelector: ImageSelector
    ){
    }
    
    resize(dimensions: ElementDimensions){
        if (dimensions.width){
            this.element.width += dimensions.width
        } else if (dimensions.height){
        this.element.height += dimensions.height
        }
    }
    
    move(dimensions: ElementDimensions){
        this.element.positionX += dimensions.left
        this.element.positionY += dimensions.top 
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
    
    onAddButtonClick(){
        this.imageSelector.openSelectorWindow(<ImageContent>this.element.content);
    }
    
    onDeleteButtonClick(){
        (<ImageContent>this.element.content).image = null;
    }
    
    onPlusButtonClick(){
        var content = <ImageContent>this.element.content
        content.width = content.width * 1.1;
        content.height = content.height * 1.1;    
    }
    
    onMinusButtonClick(){
        var content = <ImageContent>this.element.content
        content.width = content.width * 0.9;
        content.height = content.height * 0.9;     
    }
    
    onDoneAdjustButtonClick(){
        this.draggable = true;
    }
    
    onAdjustButtonClick(){
        this.draggable = false;
    }
       
}