import { Component, ElementRef, Input, OnInit} from '@angular/core';
import { FrameElement } from './frame-element'
import { ImageContent, ImageContentCommands } from '../content/image-content';
import { ElementDimensions} from '../draggable.directive'
import { NewPageReference } from '../page/new-page.ref'
import { ElementCommands} from './element';
import { ElementStore } from '../element/element.store'
import {Page} from '../page/page'
import {Image} from '../image/image'

@Component({
    selector: 'create-new-frame-element',
    template: `
        <span *ngIf="!loading && !error && selected && element?.content?.image" style="position: absolute; margin-top: -40px; z-index: 1000">
            <button md-raised-button (click)="onDoneAdjustButtonClick()"  [color]="draggable ? 'accent' : 'background'" md-icon-button mdTooltip="adjust frame"><md-icon>zoom_out_map</md-icon></button>
            <button md-raised-button (click)="onAdjustButtonClick()"  [color]="!draggable ? 'accent' : 'background'"  md-icon-button mdTooltip="adjust image"><md-icon>photo_size_select_large</md-icon></button>
            <span *ngIf="!draggable">
                <button md-icon-button [mdMenuTriggerFor]="adjustImageMenu"><md-icon>more_vert</md-icon></button>
                <md-menu #adjustImageMenu="mdMenu">
                  <button md-menu-item (click)="onDeleteButtonClick()">
                    <span>Delete image</span>
                  </button>                         
                </md-menu>
            </span>
        </span>
        <div class="inner" #frame *ngIf="draggable"  (drop)="onDrop($event)" (dragover)="onDragOver($event)" [class.selected]="selected" draggable2 (move) ="move($event)" [style.background-color] = "element.background_color" [style.width.px]="element.width" [style.height.px]="element.height" [style.top.px]="element.positionY" [style.left.px]="element.positionX">
            <div *ngIf="loading|| error" class="shutter">
                <md-spinner class="spinner" *ngIf="loading && !error"></md-spinner>
                <md-icon *ngIf="error">error</md-icon>
            </div>
            <div [style.opacity]="element.opacity ? element.opacity/100 : 1" >
                <display-content [hidden]="loading||error"  *ngIf="element.content" (loaded)="onLoad($event)"  (loadingError)="onError($event)" [content] = "element.content"></display-content>
            </div>       
        </div>
        
        <div #frame *ngIf="!draggable && element?.content?.image" [class.selected]="selected" class= "inner frame-static" [style.background-color] = "element.background_color" [style.width.px]="element.width" [style.height.px]="element.height" [style.top.px]="element.positionY" [style.left.px]="element.positionX" >
            <image-handle>
                <div [style.opacity]="element.opacity ? element.opacity/100 : 1" >
                    <display-content-img-drag  #handleContent [content] = "element.content"></display-content-img-drag>
                </div>
            </image-handle>           
        </div>
    `,
    styles:[`
        .inner {
            overflow: hidden;
            border: 2px dashed gray;         
        }
        .button{
            z-index: 1000;
            position: absolute;
            margin-right: 10px;
        }    
    `]
})

export class NewFrameElementComponent implements OnInit{
    
    @Input()
    element : FrameElement
    
    draggable: boolean = true;
    selected: boolean
    hideHandles: boolean
    loading: boolean = false;
    error: boolean = false;

    constructor(
        public elementRef: ElementRef, 
        private newPage: NewPageReference,
        private contentCommands: ImageContentCommands,
        private elementCommands: ElementCommands,
        private elementStore: ElementStore,
    ){
        this.elementStore.element.subscribe(element =>this.selected = this.element === element)
    }

    ngOnInit(){
        if(this.element && this.element.content && (<ImageContent>this.element.content).image){
            this.loading = true
        }
    }

    onDragOver(event){
        event.stopPropagation();
        return false
    }

    onLoad(image: Image){         
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
        event.stopPropagation()
        event.preventDefault()
    }
    
    resize(dimensions: ElementDimensions){
        this.newPage.resize(this.element,dimensions)
    }
    
    move(dimensions: ElementDimensions){
        let d = this.newPage.move(this.element,dimensions)
        if(d){
            this.elementCommands.startMovingElement(this.element,d)
        }    
    }
    
    outOfBounds(dimensions: ElementDimensions){
        this.element.width = dimensions.width
        this.element.height = dimensions.height
        this.element.positionX = dimensions.left
        this.element.positionY = dimensions.top
    }
    
    onDeleteButtonClick(){
        (<ImageContent>this.element.content).image = null;
        this.draggable = true
        this.hideHandles = false
    }
    
    onDoneAdjustButtonClick(){
        this.hideHandles = false
        this.draggable = true;
    }
    
    onAdjustButtonClick(){
        this.hideHandles = true
        this.draggable = false;
    }
       
}