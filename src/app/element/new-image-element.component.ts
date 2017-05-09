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
import {Page} from '../page/page'

@Component({
    selector: 'create-new-image-element',
    template: `
        <div draggable2 [style.opacity]="element.opacity ? element.opacity/100 : 1" [class.selected]="selected" (move) ="move($event)" [style.top.px]="element.positionY" [style.left.px]="element.positionX" [style.width.px]="element.width ? element.width : 100 " [style.height.px]="element.height ? element.height : 100">
            <image (loaded)="onLoad($event)" *ngIf="element?.image" [image]="element.image"></image>          
        </div>
    `,
    styles: [
        `
        `
    ]
})

       
export class NewImageElementComponent {
    
    @Input()
    element : ImageElement
    selected: boolean
     
    constructor(private newPage: NewPageRemote, private elementStore: ElementStore, private commands: ElementCommands){
        this.elementStore.element.subscribe(element =>this.selected = this.element === element)
    }
    
    onLoad(image: Image){
        if(this.element.width && this.element.height){
            return
        }
        
        let page = this.newPage.component.page
        let width = image.originalWidth
        let height = image.originalHeight
        let pageWidth = page.width ? page.width : Page.presetDimensions.A4.width
        let pageHeight = page.height ? page.height : Page.presetDimensions.A4.height
        if(width> pageWidth*3){
            let ratio = image.originalWidth/image.originalHeight  
            width = pageWidth*3*ratio
            height = pageWidth*3
        } 
        if(height > pageHeight*3){
            let ratio = image.originalHeight/image.originalWidth  
            width = pageHeight*3
            height = pageHeight*3*ratio
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