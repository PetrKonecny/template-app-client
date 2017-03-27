import { Component, ElementRef, Input, KeyValueDiffers, KeyValueDiffer} from '@angular/core';
import { FrameElement } from './frame-element'
import { ImageContent } from '../content/image-content';
import { ElementDimensions} from '../resizable.directive'
import { NewPageRemote } from '../page/new-page.remote'
import { ElementStore } from '../element/element.store'

@Component({
    selector: 'display-frame-element',
    template: `
        <div [class.selected]="selected" class= "inner" (drop)="onDrop($event)" (dragover)="onDragOver()" [style.background-color] = "element.background_color" [style.width.px]="element.width" [style.height.px]="element.height" [style.top.px]="element.positionY" [style.left.px]="element.positionX" >
            <span *ngIf="selected && element?.content?.image" style="position: absolute; top: -40px; z-index: 1000">
                <button md-raised-button *ngIf="!draggable" (click)="onDoneAdjustButtonClick()"  md-icon-button mdTooltip="adjust frame"><md-icon>done</md-icon></button>
                <button md-raised-button *ngIf="draggable" (click)="onAdjustButtonClick()" md-icon-button mdTooltip="adjust image"><md-icon>photo_size_select_large</md-icon></button>
                <span *ngIf="!draggable">
                    <button md-icon-button [mdMenuTriggerFor]="adjustImageMenu"><md-icon>more_vert</md-icon></button>
                    <md-menu #adjustImageMenu="mdMenu">
                      <button md-menu-item (click)="onDeleteButtonClick()">
                        <span>Delete image</span>
                      </button>                         
                    </md-menu>
                </span>
            </span>
            <div class="content"> 
                <display-content *ngIf="draggable && element.content" [content] = "element.content"></display-content>
            </div>
            <image-handle *ngIf="!draggable && element.content && element.content.image">
                <display-content-img-drag #handleContent [content] = "element.content"></display-content-img-drag>
            </image-handle>
        </div>
    `,
    styles:[`
        .content {
            overflow: hidden;
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
        }
        .inner {
            position: absolute;
            border: 1px dashed gray;
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
    
    draggable = true;    


    constructor(
        private elementStore: ElementStore,
    ){
        this.elementStore.element.subscribe(element =>this.selected = this.element == element)
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
        this.draggable = true;
        (<ImageContent>this.element.content).image = null;
    }

    onDoneAdjustButtonClick(){
        this.draggable = true;
    }
    
    onAdjustButtonClick(){
        this.draggable = false;
    }    
}