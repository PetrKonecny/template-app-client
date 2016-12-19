import { Component, Input, HostListener} from '@angular/core';
import { Guide } from './guide'
import { ElementDimensions } from './draggable.directive'
import { Draggable2 } from './draggable2.directive'
import { RulerSelector } from './ruler-selector'

@Component({
    selector: 'display-ruler',
    template: `
        <div *ngIf="guide.positionX" draggable2 [propagate]="false" [borderCheck]="false" (move)="move($event)" class="vertical" [style.left]="guide.positionX" ></div>
        <div *ngIf="guide.positionY" draggable2 [propagate]="false" [borderCheck]="false" (move)="move($event)" [style.top]="guide.positionY" class="horizontal"></div>
    `,
    styles: [` 
            .vertical{
                width: 2px; 
                height: 100%; 
                cursor: ew-resize;	
            }
            .horizontal{
                height: 2px; 
                width: 100%;
                cursor: ns-resize;	
            }
            div{
                background-color: blue; 
                position: absolute;
            } 
    `],
    directives: [Draggable2]
})

       
export class DisplayRulerComponent {
    
    @Input()
    guide : Guide
    
    constructor(private rulerSelector: RulerSelector){}
    
    @HostListener('mousedown', ['$event'])
    onMousedown(event) {
        this.rulerSelector.selectRuler(this.guide)
    }
    
    move(dimensions: ElementDimensions){
        if(this.guide.positionX){
            this.guide.positionX += dimensions.left
        } else if (this.guide.positionY){
            this.guide.positionY += dimensions.top
        }
    }
    
    
      
}