import { Component, Input, ElementRef } from '@angular/core';
import { ImageElement } from './image-element'
import { NewPageRemote } from '../page/new-page.remote'
import { ElementDimensions } from '../resizable.directive'
import { AppConfig } from '../app.config'
import { Element, ElementCommands} from './element';
import { ElementStore } from '../element/element.store'
import { ImageService } from '../image/image.service'

@Component({
    selector: 'create-new-image-element',
    template: `
        <md-spinner *ngIf="loading"></md-spinner>
        <img [hidden]="loading" (load)="onLoad()" draggable2 [style.opacity]="element.opacity ? element.opacity/100 : 1" [class.selected]="selected" (resize) ="resize($event)" (move) ="move($event)" [propagate]="false" [style.top.px]="element.positionY" [style.left.px]="element.positionX" [width]="element.width" [height]="element.height" src="{{config.getConfig('api-url')}}/img/{{element.image.image_key}}.{{element.image.extension}}">          
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
    loading: boolean = true 
     
    constructor(private image: ElementRef, private newPage: NewPageRemote, private elementStore: ElementStore, private config: AppConfig, private commands: ElementCommands, private imageService: ImageService){
        this.elementStore.element.subscribe(element =>this.selected = this.element == element)
    }
    
    ngDoCheck(){
        if((!this.element.width || !this.element.height) && this.image ){
            this.element.width = this.image.nativeElement.naturalWidth
            this.element.height = this.image.nativeElement.naturalHeight
        }
    }

    onLoad(){
        this.loading = false
    }
    
    onElementClicked(){
        this.elementStore.changeElement(this.element);
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