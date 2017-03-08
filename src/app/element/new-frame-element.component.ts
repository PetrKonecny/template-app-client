import { Component, ElementRef, Input, KeyValueDiffers, KeyValueDiffer} from '@angular/core';
import { FrameElement } from './frame-element'
import { ElementSelector} from '../element/element-selector'
import { ImageSelector } from '../image/image-selector';
import { ImageContent, ImageContentCommands } from '../content/image-content';
import { ElementDimensions} from '../resizable.directive'
import { NewPageRemote } from '../page/new-page.remote'
import { ElementCommands} from './element';

@Component({
    selector: 'create-new-frame-element',
    template: `
        <span *ngIf="selected && element?.content?.image" style="position: absolute; margin-top: -40px; z-index: 1000">
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
        <div #frame *ngIf="draggable"  (drop)="onDrop($event)" (dragover)="onDragOver($event)" [class.selected]="selected" draggable2 resizable (resize) ="resize($event)" (move) ="move($event)" (outOfBounds)="outOfBounds($event)" class= "inner" [style.background-color] = "element.background_color" [style.width.px]="element.width" [style.height.px]="element.height" [style.top.px]="element.positionY" [style.left.px]="element.positionX">
            <display-content *ngIf="element.content" [content] = "element.content"></display-content>       
        </div>
        <div #frame *ngIf="!draggable && element?.content?.image" [class.selected]="selected" class= "inner" [style.background-color] = "element.background_color" [style.width.px]="element.width" [style.height.px]="element.height" [style.top.px]="element.positionY" [style.left.px]="element.positionX" >
            <image-handle>
                <display-content-img-drag #handleContent [content] = "element.content"></display-content-img-drag>
            </image-handle>           
        </div>
    `,
    styles:[`
        .inner {
            overflow: hidden;         
        }
        .button{
            z-index: 1000;
            position: absolute;
            margin-right: 10px;
        }

    `]
})

export class NewFrameElementComponent {
    
    @Input()
    element : FrameElement
    
    draggable: boolean = true;
    selected: boolean
    hideHandles: boolean
        
    constructor(
        public elementRef: ElementRef, 
        private elementSelector: ElementSelector,
        private imageSelector: ImageSelector,
        private newPage: NewPageRemote,
        private contentCommands: ImageContentCommands,
        private elementCommands: ElementCommands
    ){
        this.elementSelector.element.subscribe(element =>this.selected = this.element == element)
    }

    onDragOver(event){
        event.stopPropagation();
        return false
    }

    onDrop(event){
        console.log('drop1')
        let data = event.dataTransfer.getData("text");
        let image 
        try{
            image = JSON.parse(data)
        }catch(e){
            return 
        }
        let content = <ImageContent>this.element.content
        this.contentCommands.SetImage(<ImageContent>content,image)
        event.stopPropagation();
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
    
    onAddButtonClick(){
        this.imageSelector.openSelectorWindow();
        let sub = this.imageSelector.selectorWindowOpened.take(1).subscribe() 
        this.imageSelector.image.takeWhile(image => !sub.closed).subscribe((image) => (<ImageContent>this.element.content).image = image)
    }
    
    onDeleteButtonClick(){
        (<ImageContent>this.element.content).image = null;
        this.draggable = true
        this.hideHandles = false
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
        this.hideHandles = false
        this.draggable = true;
    }
    
    onAdjustButtonClick(){
        this.hideHandles = true
        this.draggable = false;
    }
       
}