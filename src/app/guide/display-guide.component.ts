import { Component, Input} from '@angular/core';
import { Guide } from './guide'

@Component({
    selector: 'display-guide',
    template: `
        <div *ngIf="guide.positionX" class="vertical" [style.left.px]="guide.positionX" ></div>
        <div *ngIf="guide.positionY" [style.top.px]="guide.positionY" class="horizontal"></div>
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
                background-color: red; 
                position: absolute;
            } 
    `]
})

       
export class DisplayGuideComponent {
    
    @Input()
    guide : Guide
      
}