import { Component, OnInit, Input, ViewChild, Query, ElementRef, AfterViewInit} from '@angular/core';
import { Element} from './element';
import { Image } from './image';
import { DisplayContentComponent } from './display-content.component';
import { TemplateInstanceStore} from './template-instance.store';
import { ImageSelector} from './image-selector';
import { ImageContent } from './image-content';
import { TextContent } from './text-content' 
import { TextElement} from './text-element'

@Component({
    selector: 'display-element',
    template: `\n\
        <div *ngIf="element.type === 'text_element'" class ="element" [style.width.px]="element.width"   [style.height.px]="element.height" [style.left.px] = "element.positionX" [style.top.px] = "element.positionY">
            <span #textContainer ><display-content *ngIf="element.content" [content] = "element.content"></display-content></span>
        </div>
        <div *ngIf="element.type === 'image_element'" class ="element" [style.width.px]="element.width"   [style.height.px]="element.height" [style.left.px] = "element.positionX" [style.top.px] = "element.positionY">
            <display-content *ngIf="element.content" [content] = "element.content"></display-content>
            <button *ngIf="!element.content.image" (click)="onAddButtonClick()" >Add image</button>
            <button *ngIf="element.content.image" (click)="onDeleteButtonClick()" class="button">Delete image</button>
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
            bottom: 10px;
            right: 10px;
            z-index: 1000;
        }
    `],
    directives: [DisplayContentComponent]
})

export class DisplayElementComponent implements OnInit, AfterViewInit{

    @Input()
    element: Element;
    
    @ViewChild(DisplayContentComponent)
    contentComponent : DisplayContentComponent;
    
    @ViewChild('textContainer')
    textContainer : ElementRef;
    
    constructor(private templateInstanceStore: TemplateInstanceStore,
                private imageSelector: ImageSelector
    ){}
    

    ngOnInit(){
        this.element.content = this.templateInstanceStore.getContentForElement(this.element);
        this.element.content.element_id = this.element.id;
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
        this.contentComponent.saveContent();
    }
}