import { Component, Input} from '@angular/core';
import { Page} from './page';

@Component({
    selector: 'display-page',
    template: `\n\
        <br>
        <div class ="page">
            <display-element *ngFor ="let element of page.elements" [element] = "element"></display-element>
        </div>
    `,
    styles:[`
        .page {
            width: 210mm;
            background-color: white;
            border: 1px solid grey;
            height: 297mm;
            position: relative;
        }
    `]
})

export class DisplayPageComponent  {

    @Input()
    page: Page; 
    
}