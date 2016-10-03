import { Component, OnInit, Input, ViewChild, Query} from '@angular/core';
import { Element} from './element';
import { Image } from './image';
import { DisplayContentComponent } from './display-content.component';
import { TemplateInstanceStore} from './template-instance.store';
import { ImageSelector} from './image-selector';
import { ImageContent } from './image-content';
import { TextContent } from './text-content' 

@Component({
    selector: 'display-element',
    template: `\n\
        <div *ngIf="element.type === 'text_element'" class ="element" [style.width.px]="element.width"   [style.height.px]="element.height" [style.left.px] = "element.positionX" [style.top.px] = "element.positionY">
            <display-content *ngIf="element.content" [content] = "element.content"></display-content>
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

export class DisplayElementComponent implements OnInit{

    @Input()
    element: Element;
    
    @ViewChild(DisplayContentComponent)
    contentComponent : DisplayContentComponent;
    
    constructor(private templateInstanceStore: TemplateInstanceStore,
                private imageSelector: ImageSelector
    ){}
    

    ngOnInit(){
        this.element.content = this.templateInstanceStore.getContentForElement(this.element);
        this.element.content.element_id = this.element.id;
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