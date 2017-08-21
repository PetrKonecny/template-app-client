import { Component, Input} from '@angular/core';
import { Guide } from './guide'
import { AppComponentRef } from '../app.ref'

@Component({
    selector: 'display-guide',
    template: `
        <div *ngIf="guide.positionX && guide.visible" class="vertical" [style.left.px]="guide.positionX" ></div>
        <div *ngIf="guide.positionY && guide.visible" [style.top.px]="guide.positionY" class="horizontal"></div>
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

//displays temporary guide in the editor
export class DisplayGuideComponent {
    
    constructor(private ref: AppComponentRef){
        this.ref.ctrilPRess.subscribe((pressed)=>{
                this.guide.visible = !pressed
            }
        )
    }
    //guide to be displayed
    @Input()
    guide : Guide      
}