import { Component, Input} from '@angular/core';
import { Page} from './page';

@Component({
    selector: 'display-page',
    template: `
        <br>
        <div class ="page mat-elevation-z1" [style.width.mm]="getPageWidth()" [style.height.mm]="getPageHeight()">
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

//displays page in document editor
export class DisplayPageComponent  {

    @Input()
    //page to be displayed
    page: Page; 

    //gets page width
    getPageWidth(){
        if(this.page.width){
            return this.page.width
        }else{
            return Page.defaultWidth
        }
    }

    //gets page height
    getPageHeight(){
        if(this.page.height){
            return this.page.height
        }else{
            return Page.defaultHeight
        }
    }
    
}