import { Component, ElementRef, Input, KeyValueDiffers, KeyValueDiffer} from '@angular/core';
import { FrameElement } from './frame-element'
import { ImageContent, ImageContentCommands } from '../content/image-content';
import { ElementStore } from '../element/element.store'

@Component({
    selector: 'display-frame-element',
    template: `
        <div [class.selected]="selected" class= "inner" (drop)="onDrop($event)" (dragover)="onDragOver()" [style.background-color] = "element.background_color" [style.width.px]="element.width" [style.height.px]="element.height" [style.top.px]="element.positionY" [style.left.px]="element.positionX" >
            <span *ngIf="!loading && !error && selected && element?.content?.image" style="position: absolute; top: -40px; z-index: 1000">
                <button md-raised-button *ngIf="!draggable" (click)="onDoneAdjustButtonClick()"  md-icon-button mdTooltip="upravit rámeček"><md-icon>done</md-icon></button>
                <button md-raised-button *ngIf="draggable" (click)="onAdjustButtonClick()" md-icon-button mdTooltip="upravit obrázek"><md-icon>photo_size_select_large</md-icon></button>
                <span *ngIf="!draggable">
                    <button md-icon-button [mdMenuTriggerFor]="adjustImageMenu"><md-icon>more_vert</md-icon></button>
                    <md-menu #adjustImageMenu="mdMenu">
                      <button md-menu-item (click)="onDeleteButtonClick()">
                        <span>Delete image</span>
                      </button>                         
                    </md-menu>
                </span>
            </span>
            <div *ngIf="loading || error" class="shutter">
                <md-spinner class="spinner" *ngIf="loading && !error"></md-spinner>
                <md-icon *ngIf="error">error</md-icon>
            </div>
            <div class="content"> 
                <display-content [hidden]="loading||error" (loaded)="onLoad($event)"  (loadingError)="onError($event)"  *ngIf="draggable && element.content" [content] = "element.content"></display-content>
            </div>
            <image-handle *ngIf="!draggable && element.content && element?.content?.image">
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
    loading
    error

    draggable = true;    


    constructor(
        private elementStore: ElementStore, private contentCommands: ImageContentCommands
    ){
        this.elementStore.element.subscribe(element =>this.selected = this.element == element)
    }

    onDragOver(){
        return false
    }

    onDrop(event){
       this.loading = true
        this.error = false
        let data = event.dataTransfer.getData("data");
        let image 
        try{
            image = JSON.parse(data)
        }catch(e){
            this.onError()
            return 
        }
        let content = <ImageContent>this.element.content
        content.top = 0
        content.left = 0
        content.width = 0 
        content.height = 0 
        this.contentCommands.SetImage(<ImageContent>content,image)      
        event.stopPropagation();
    }

    onLoad(image){
        let content = <ImageContent> this.element.content
        this.loading = false
        if(content.width && content.height){
            return
        } 
        let width = image.originalWidth
        let height = image.originalHeight
        if(height > width){
            let ratio = image.originalHeight/image.originalWidth  
            content.width = this.element.width
            content.height = this.element.width * ratio
        }else{
            let ratio = image.originalWidth/image.originalHeight  
            content.width = this.element.height * ratio
            content.height = this.element.height          
        }
    }

    onError(){
        this.error = true
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