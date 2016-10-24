import { Component, OnInit, Input, ViewChild, Query, ElementRef, AfterViewInit} from '@angular/core';
import { Element} from './element';
import { Image } from './image';
import { DisplayContentComponent } from './display-content.component';
import { TemplateInstanceStore} from './template-instance.store';
import { ImageSelector, ImageRefreshable} from './image-selector';
import { ImageContent } from './image-content';
import { TextContent } from './text-content' 
import { TextElement} from './text-element'
import { DisplayContentImgDragComponent } from './display-content-img-drag.component';

@Component({
    selector: 'display-element',
    template: `\n\
        <div *ngIf="element.type === 'text_element'" class ="element" [style.width.px]="element.width"   [style.height.px]="element.height" [style.left.px] = "element.positionX" [style.top.px] = "element.positionY" [style.font-size.px] = "element.font_size">
            <span #textContainer ><display-content *ngIf="element.content" [content] = "element.content"></display-content></span>
        </div>
        <div *ngIf="element.type === 'image_element'" class ="element" [style.width.px]="element.width"   [style.height.px]="element.height" [style.left.px] = "element.positionX" [style.top.px] = "element.positionY">\n\
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
    `],
    directives: [DisplayContentComponent, DisplayContentImgDragComponent]
})

export class DisplayElementComponent implements OnInit, AfterViewInit, ImageRefreshable{

    @Input()
    element: Element;
    
    @ViewChild(DisplayContentComponent)
    displayContent : DisplayContentComponent;
    
    @ViewChild(DisplayContentImgDragComponent)
    displayContentImgDrag :  DisplayContentImgDragComponent
    
    @ViewChild('textContainer')
    textContainer : ElementRef;
    
    draggable:boolean = true;
    
    constructor(private templateInstanceStore: TemplateInstanceStore,
                private imageSelector: ImageSelector
    ){}
    

    ngOnInit(){
        //this.element.content = this.templateInstanceStore.getContentForElement(this.element);
        //this.element.content.element_id = this.element.id;
    }
    
    ngAfterViewInit(){
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
        this.saveContent();
        this.draggable = true;
    }
    
    onAdjustButtonClick(){
        this.saveContent();
        this.draggable = false;
    }
    
    refreshImage(image: Image){
        (<ImageContent>this.element.content).image = image;
    }
        
    getWidth(){
        return this.element.width + "mm";
    }
    
    getHeight(){
        return this.element.height + "mm";
    }
    
    saveContent(){
        if (this.displayContent){
            this.displayContent.saveContent();
        }
        if (this.displayContentImgDrag){
            this.displayContentImgDrag.saveContent();
        }
    }
}