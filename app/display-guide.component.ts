import { Component, Input} from '@angular/core';
import { Guide } from './guide'

@Component({
    selector: 'display-guide',
    template: `
        <div *ngIf="guide.horizontal" class="horizontal" [style.left]="guide.positionX" [style.top]="guide.positionY"></div>
        <div *ngIf="!guide.horizontal" [style.left]="guide.positionX" [style.top]="guide.positionY" class="vertical"></div>
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
                background-color:black; 
                position: absolute;
            } 
    `]
})

       
export class DisplayGuideComponent {
    
    @Input()
    guide : Guide
      
}