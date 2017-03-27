import { Component, Input, ElementRef } from '@angular/core';
import { ImageElement } from './image-element'
import { NewPageRemote } from '../page/new-page.remote'
import { ElementDimensions } from '../resizable.directive'
import { AppConfig } from '../app.config'
import { Element, ElementCommands} from './element';
import { ElementStore } from '../element/element.store'
import { ImageService } from '../image/image.service'
import {Image} from '../image/image'
import {TemplateHelper} from '../template/template.helper'
@Component({
    selector: 'create-new-image-element',
    template: `
        <div draggable2 [style.opacity]="element.opacity ? element.opacity/100 : 1" [class.selected]="selected" (move) ="move($event)" [style.top.px]="element.positionY" [style.left.px]="element.positionX" [style.width.px]="element.width" [style.height.px]="element.height">
            <image (loaded)="onLoad($event)" *ngIf="element?.image" [image]="element.image"></image>          
        </div>
    `,
    styles: [
        `img{
        }


        `
    ]
})

       
export class NewImageElementComponent {
    
    @Input()
    element : ImageElement
    selected: boolean
     
    constructor(private newPage: NewPageRemote, private elementStore: ElementStore, private config: AppConfig, private commands: ElementCommands){
        this.elementStore.element.subscribe(element =>this.selected = this.element == element)
    }
    
    onLoad(image: Image){
        let page = this.newPage.component.page
        let width = image.originalWidth
        let height = image.originalHeight
        if(width> page.width*3){
            let ratio = image.originalWidth/image.originalHeight  
            width = page.width*3*ratio
            height = page.width*3
        } 
        if(height > page.height*3){
            let ratio = image.originalHeight/image.originalWidth  
            width = page.height*3
            height = page.height*3*ratio
        }
        this.element.width = width
        this.element.height = height
    }
    
    onElementClicked(){
        this.elementStore.changeElement(this.element);
    } 
    
    move(dimensions: ElementDimensions){
       let d = this.newPage.move(this.element,dimensions)
        if(d){
            this.commands.startMovingElement(this.element,d)
        }
    }
      
}