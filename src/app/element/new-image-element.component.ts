import { Component, Input, ElementRef } from '@angular/core';
import { ImageElement } from './image-element'
import { NewPageRemote } from '../page/new-page.remote'
import { ElementDimensions } from '../resizable.directive'
import { ElementSelector } from './element-selector'
import { AppConfig } from '../app.config'
import { Element, ElementCommands} from './element';

@Component({
    selector: 'create-new-image-element',
    template: `
        <img draggable2 resizable [style.opacity]="+element.opacity/100" [class.selected]="selected" (resize) ="resize($event)" (move) ="move($event)" [propagate]="false" [style.top.px]="element.positionY" [style.left.px]="element.positionX" [width]="element.width" [height]="element.height" src="{{config.getConfig('api-url')}}/img/{{element.image.image_key}}.{{element.image.extension}}">          
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
     
    constructor(private image: ElementRef, private newPage: NewPageRemote, private elementSelector: ElementSelector, private config: AppConfig, private commands: ElementCommands){
        this.elementSelector.element.subscribe(element =>this.selected = this.element == element)
    }
    
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
       let d = this.newPage.move(this.element,dimensions)
        if(d){
            this.commands.startMovingElement(this.element,d)
        }
    }
      
}