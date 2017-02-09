import { Component, ElementRef, Input, KeyValueDiffers, KeyValueDiffer} from '@angular/core';
import { FrameElement } from './frame-element'
import { ElementSelector} from '../element/element-selector'
import { ImageSelector } from '../image/image-selector';
import { ImageContent } from '../content/image-content';
import { ElementDimensions} from '../resizable.directive'
import { NewPageRemote } from '../page/new-page.remote'

@Component({
    selector: 'display-frame-element',
    template: `      
        <div [class.selected]="selected" class= "inner" (drop)="onDrop($event)" (dragover)="onDragOver()" [style.background-color] = "element.background_color" [style.width.px]="element.width" [style.height.px]="element.height" [style.top.px]="element.positionY" [style.left.px]="element.positionX" >
            <display-content-img-drag *ngIf="element.content && element.content.image" [content] = "element.content"></display-content-img-drag>
            <button *ngIf="element.content && element.content.image && selected" style="top: 40px" class="button"  (click)="onPlusButtonClick()" >Zoom in</button>
            <button *ngIf="element.content && element.content.image && selected" style="top: 60px" class="button"  (click)="onMinusButtonClick()" >Zoom out</button>
            <button *ngIf="element.content && element.content.image && selected" (click)="onDeleteButtonClick()" class="button">Delete image</button>
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

    `]
})

export class DisplayFrameElementComponent {
    
    @Input()
    element : FrameElement
    
    selected: boolean
        
    constructor(
        private elementSelector: ElementSelector,
    ){
        this.elementSelector.element.subscribe(element =>this.selected = this.element == element)
    }

    onDragOver(){
        return false
    }

    onDrop(event){
        let data = event.dataTransfer.getData("text");
        let image = JSON.parse(data)
        let content = <ImageContent>this.element.content
        content.image = image
        event.stopPropagation();
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
       
}