import { Component, Input, HostListener} from '@angular/core';
import { Guide } from './guide'
import { ElementDimensions } from '../resizable.directive'

@Component({
    selector: 'display-ruler',
    template: `
        <div *ngIf="guide.positionX != null" class="vertical" [style.left.px]="guide.positionX" ></div>
        <div *ngIf="guide.positionY != null" [style.top.px]="guide.positionY" class="horizontal"></div>
    `,
    styles: [` 
            .vertical{
                width: 1px; 
                height: 100%; 
            }
            .horizontal{
                height: 1px; 
                width: 100%;
            }
            div{
                background-color: blue; 
                position: absolute;
            } 
    `]
})

//displays permament guide 
export class DisplayRulerComponent {
    
    @Input()
    //guide to display
    guide : Guide
      
}