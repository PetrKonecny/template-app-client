import { Component, Input, HostListener} from '@angular/core';
import { Guide } from './guide'

@Component({
    selector: 'display-ruler',
    template: `
        <div *ngIf="guide.positionX != null" class="ruler vertical" [style.left.px]="guide.positionX" ></div>
        <div *ngIf="guide.positionY != null" [style.top.px]="guide.positionY" class="ruler horizontal"></div>
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
    `]
})

//displays permament guide 
export class DisplayRulerComponent {
    
    @Input()
    //guide to display
    guide : Guide
      
}