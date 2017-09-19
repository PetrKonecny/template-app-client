import { Component, Input, ElementRef } from '@angular/core';
import { ImageElement } from './image-element'
import { NewPageReference } from '../page/new-page.ref'
import { ElementDimensions } from '../draggable.directive'
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
        <div draggable2 [style.opacity]="element.opacity ? element.opacity/100 : 1" [class.animated]="animated" [class.selected]="selected" (move) ="move($event)" [style.top.px]="element.positionY" [style.left.px]="element.positionX" [style.width.px]="element.width ? element.width : 100 " [style.height.px]="element.height ? element.height : 100">
            <image (loaded)="onLoad($event)" *ngIf="element?.image" [image]="element.image"></image>          
        </div>
    `,
    styles: [
        `
        `
    ]
})

//displays image elements in template editor and resizes them on load to fit the page       
export class NewImageElementComponent {
    
    @Input()
    //element to be displayed
    element : ImageElement
    //true if element is selected false otherwise
    selected: boolean
    animated: boolean = false

    /**
    @param newPage - injects reference to new page for moving the element
    @param elementStore - injects reference to the store containing selected element
    @param commands - injects element commands to provide operations on the element
    **/ 
    constructor(private newPage: NewPageReference, private elementStore: ElementStore, private commands: ElementCommands){
        this.elementStore.element.subscribe(element =>this.selected = this.element === element)
    }

    
    /** method that is called when image is done loading
    resizes new image element to not be significantly bigger than the page
    **/
    onLoad(image: Image){

        //this means we are loading already saved image that should not be resized
        if(this.element.width && this.element.height){
            return
        }
        this.animated = true
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
        //delay value should be same as css transition duration
        setInterval(()=>{this.animated = false},200)
    }
    

    //called if element is clicked, changes element in the store
    onElementClicked(){
        this.elementStore.changeElement(this.element);
    } 
    
    //called as an output of draggable directive
    move(dimensions: ElementDimensions){
       let d = this.newPage.move(this.element,dimensions)
        if(d){
            this.commands.startMovingElement(this.element,d)
        }
    }
      
}