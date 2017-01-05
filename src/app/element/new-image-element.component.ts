import { Component, Input, ElementRef } from '@angular/core';
import { ImageElement } from './image-element'
import { PageService } from '../page/page.service'
import { ElementDimensions } from '../resizable.directive'
import { ElementSelector } from './element-selector'

@Component({
    selector: 'create-new-image-element',
    template: `
        <img draggable2 resizable (click)="onElementClicked()" (resize) ="resize($event)" (move) ="move($event)" [propagate]="false" [style.top.px]="element.positionY" [style.left.px]="element.positionX" [width]="element.width" [height]="element.height" src="http://localhost:8080/img/{{element.image.image_key}}.{{element.image.extension}}">          
    `,
    styles: [
        `img{
            position: absolute;
        }


        `
    ]
})

       
export class NewImageElementComponent {
    
    @Input()
    element : ImageElement
     
    constructor(private image: ElementRef, private newPage: PageService, private elementSelector: ElementSelector){}
    
    ngDoCheck(){
        if((!this.element.width || !this.element.height) && this.image ){
            this.element.width = this.image.nativeElement.naturalWidth
            this.element.height = this.image.nativeElement.naturalHeight
        }
    }
    
    onElementClicked(){
        this.elementSelector.changeElement(this.element);
    } 
    
    resize(dimensions: ElementDimensions){
        this.newPage.resize(this.element,dimensions)
    }
    
    move(dimensions: ElementDimensions){
        this.newPage.move(this.element,dimensions)
    }
      
}