import { Component, ElementRef, Input} from '@angular/core';
//import { NgGrid, NgGridItem } from 'angular2-grid';
import { Element} from './element';
import { ElementSelector } from './element-selector'
import { Draggable} from './draggable.directive'

@Component({
    selector: 'create-new-element',
    template: `
        <div draggable (click)="onElementClicked()" class= "inner" [style.width.px]="element.width" [style.height.px]="element.height" [style.left.px] = "element.positionX" [style.top.px] = "element.positionY">
                <span [ngSwitch]=element.type>
                    <span *ngSwitchCase="'text_element'">
                        <h4>New Text Element</h4>\n\
                        Position X: {{element.positionX}}<br>
                        Position Y: {{element.positionY}}<br>
                        Width: {{element.width}}<br>
                        Height: {{element.height}}<br>
                    </span>
                    <span *ngSwitchCase="'image_element'">
                        <h4>New Image Element</h4>
                        Position X: {{element.positionX}}<br>
                        Position Y: {{element.positionY}}<br>
                        Width: {{element.width}}<br>
                        Height: {{element.height}}<br>
                    </span>
                </span>
        </div>
    `,
    styles:[`
        .inner {
            position: absolute;           
            background-color: rgba(0, 0, 0, 0.25);
        }
    `],
    directives: [Draggable]
})

export class NewElementComponent  {
    
    @Input()
    element : Element
    
    constructor(public elementRef: ElementRef, private elementSelector: ElementSelector ){}
    
    fillFromDOM(){
        this.element.height = this.elementRef.nativeElement.children[0].offsetHeight;
        this.element.width = this.elementRef.nativeElement.children[0].offsetWidth;
        this.element.positionX = this.elementRef.nativeElement.children[0].offsetLeft;
        this.element.positionY = this.elementRef.nativeElement.children[0].offsetTop;
    }
    
    onElementClicked(){
        this.elementSelector.changeElement(this.element, this);
    }
    
    getCol(){
        if (this.element.id > 0){
            return Math.ceil(this.element.positionX / 79.3688);
        }else{
            return 1;
        }
       
    }
    getRow(){
        if (this.element.id > 0){
            return Math.ceil(this.element.positionY / 112.252);
        }else{
            return 1;
        }
    }
    
    getWidth(){
        if (this.element.id > 0){
            return Math.floor(this.element.width / 79.3688);
        }else{
            return 1;
        }
    }
    
    getHeight(){
        if (this.element.id > 0){
            return Math.floor(this.element.height / 112.252);
        }else{ 
            return 1;
        }
    }
    
}