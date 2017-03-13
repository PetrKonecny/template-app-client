import { Component, Input} from '@angular/core';
import { Page} from './page';

@Component({
    selector: 'display-page',
    template: `
        <br>
        <div class ="page" [style.width.mm]="getPageWidth()" [style.height.mm]="getPageHeight()">
            <display-element *ngFor ="let element of page.elements" [element] = "element"></display-element>
        </div>
    `,
    styles:[`
        .page {
            position: relative;
            background-color: white;
            margin-left: auto;
            margin-right: auto;
            margin-top: 5px;
        }
    `]
})

export class DisplayPageComponent  {

    @Input()
    page: Page; 

    getPageWidth(){
        if(this.page.width){
            return this.page.width
        }else{
            return Page.defaultWidth
        }
    }

    getPageHeight(){
        if(this.page.height){
            return this.page.height
        }else{
            return Page.defaultHeight
        }
    }
    
}