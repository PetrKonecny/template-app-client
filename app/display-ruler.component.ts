import { Component, Input} from '@angular/core';
import { Guide } from './guide'
import { ElementDimensions } from './draggable.directive'
import { Draggable2 } from './draggable2.directive'

@Component({
    selector: 'display-ruler',
    template: `
        <div *ngIf="guide.positionX" draggable2 [borderCheck]="false" (move)="move($event)" class="vertical" [style.left]="guide.positionX" ></div>
        <div *ngIf="guide.positionY" draggable2 [borderCheck]="false" (move)="move($event)" [style.top]="guide.positionY" class="horizontal"></div>
    `,
    styles: [` 
            .vertical{
                width: 2px; 
                height: 100%;
            }
            .horizontal{
                height: 2px; 
                width: 100%;
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
    
    move(dimensions: ElementDimensions){
        console.log(dimensions)
        if(this.guide.positionX){
            this.guide.positionX += dimensions.left
        } else if (this.guide.positionY){
            this.guide.positionY += dimensions.top
        }
    }
    
    
      
}