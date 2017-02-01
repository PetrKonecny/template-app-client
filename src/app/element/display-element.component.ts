import { Component, Input, ViewChild, ElementRef, AfterViewInit} from '@angular/core';
import { Element} from './element';
import { Image } from '../image/image';
import { ImageSelector } from '../image/image-selector';
import { ImageContent } from '../content/image-content';
import { TextElement} from './text-element'
import { ElementSelector } from '../element/element-selector';

@Component({
    selector: 'display-element',
    template: `
        <div *ngIf="element.type === 'text_element'" class ="element" (click)="onElementClick()" [style.background-color] = "element.background_color ? element.background_color : defaultBackgroundColor" [style.color]="element.text_color ? element.text_color : defaultTextColor" [style.width.px]="element.width"   [style.height.px]="element.height" [style.left.px] = "element.positionX" [style.top.px] = "element.positionY" [style.font-size.px] = "element.font_size">
            <span #textContainer ><display-content *ngIf="element.content" [content] = "element.content"></display-content></span>
        </div>
        <div *ngIf="element.type === 'image_element'" class ="element" (click)="onElementClick()" [style.width.px]="element.width"   [style.height.px]="element.height" [style.left.px] = "element.positionX" [style.top.px] = "element.positionY">\n\
            <div *ngIf="draggable">
                <display-content *ngIf="element.content" [content] = "element.content"></display-content>
                <button *ngIf="element.content && !element.content.image" (click)="onAddButtonClick()" >Add image</button>
                <button *ngIf="element.content && element.content.image" (click)="onDeleteButtonClick()" class="button">Delete image</button>\n\
                <button *ngIf="element.content && element.content.image && draggable" style="top: 60px" class="button" (click)="onAdjustButtonClick()" class="button">Adjust image</button>
            </div>
            <div *ngIf="!draggable">
                <display-content-img-drag *ngIf="element.content" [content] = "element.content"></display-content-img-drag>
                <button *ngIf="element.content.image" style="top: 40px" class="button"  (click)="onPlusButtonClick()" >Zoom in</button>
                <button *ngIf="element.content.image" style="top: 60px" class="button"  (click)="onMinusButtonClick()" >Zoom out</button>
                <button *ngIf="element.content && element.content.image" (click)="onDoneAdjustButtonClick()" class="button">Done adjusting</button>
            </div>
        </div>
        <display-table-element *ngIf="element.type == 'table_element'" [element]="element" (click)="onElementClick()"></display-table-element>
    `,
    styles:[`
        .element {
            position: absolute;
            font-size: 12.15pt;
            background-color: rgba(0, 0, 0, 0.25);
            overflow: hidden;
        }
        .button {
            position: absolute;
            z-index: 1000;
        }
    `]
})

export class DisplayElementComponent implements AfterViewInit {

    @Input()
    element: Element;
    
    @ViewChild('textContainer')
    textContainer : ElementRef;
    
    draggable:boolean = true;
    
    defaultTextColor = TextElement.defaultTextColor
    defaultBackgroundColor = Element.defaultBackgroundColor
    
    constructor(
        private imageSelector: ImageSelector, private elementSelector: ElementSelector
    ){}
    
    ngAfterViewInit(){
        
    }

    onElementClick(){
        this.elementSelector.changeElement(this.element)
    }
    
    onAddButtonClick(){
        this.imageSelector.openSelectorWindow();
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
    
    refreshImage(image: Image){
        (<ImageContent>this.element.content).image = image;
    }
}