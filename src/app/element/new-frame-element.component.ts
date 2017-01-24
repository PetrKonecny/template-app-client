import { Component, ElementRef, Input, KeyValueDiffers, KeyValueDiffer} from '@angular/core';
import { ImageElement } from './image-element'
import { ElementSelector} from '../element/element-selector'
import { ImageSelector } from '../image/image-selector';
import { ImageContent } from '../content/image-content';
import { ElementDimensions} from '../resizable.directive'
import { NewPageRemote } from '../page/new-page.remote'

@Component({
    selector: 'create-new-frame-element',
    template: `
        <div #frame *ngIf="draggable" draggable2 resizable (resize) ="resize($event)" (move) ="move($event)" (outOfBounds)="outOfBounds($event)" (click)="onElementClicked()" class= "inner" [style.background-color] = "element.background_color" [style.width.px]="element.width" [style.height.px]="element.height" [style.top.px]="element.positionY" [style.left.px]="element.positionX">
            <display-content *ngIf="element.content" [content] = "element.content"></display-content>
            <button *ngIf="element.content && !element.content.image" style="top: 20px" class="button" (click)="onAddButtonClick()" >Add image</button>
            <button *ngIf="element.content && element.content.image" style="top: 40px" class="button" (click)="onDeleteButtonClick()" class="button">Delete image</button>
            <button *ngIf="element.content && element.content.image && draggable" style="top: 60px" class="button" (click)="onAdjustButtonClick()" class="button">Adjust image</button>
        </div>
        <div #frame *ngIf="!draggable" (click)="onElementClicked()" class= "inner" [style.background-color] = "element.background_color" [style.width.px]="element.width" [style.height.px]="element.height" [style.top.px]="element.positionY" [style.left.px]="element.positionX" >
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
    element : ImageElement
    
    draggable: boolean = true;
    differ: KeyValueDiffer;

        
    constructor(
        public elementRef: ElementRef, 
        private elementSelector: ElementSelector,
        private imageSelector: ImageSelector,
        private newPage: NewPageRemote,
        private differs: KeyValueDiffers,
    ){
        this.differ = differs.find({}).create(null);
    }

    ngDoCheck(){
        /*
        var changes = this.differ.diff(this.element);
        if(changes) {
            changes.forEachAddedItem(item => {
                console.log(item.key,item.currentValue,item.previousValue,item.currentValue === item.previousValue)
            })
            changes.forEachChangedItem(item => {
                console.log(item.key,item.currentValue,item.previousValue,item.currentValue === item.previousValue)                
            })
        }*/
        
    }
    
    resize(dimensions: ElementDimensions){
        this.newPage.resize(this.element,dimensions)
    }
    
    move(dimensions: ElementDimensions){
        this.newPage.move(this.element,dimensions)
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
        this.imageSelector.openSelectorWindow();
        let sub = this.imageSelector.selectorWindowOpened.take(1).subscribe() 
        this.imageSelector.image.takeWhile(image => !sub.closed).subscribe((image) => (<ImageContent>this.element.content).image = image)
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