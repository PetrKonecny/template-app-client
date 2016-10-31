import { Component, Input, ViewChildren, QueryList} from '@angular/core';
import { Page} from './page';
import { DisplayElementComponent } from './display-element.component';


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
            height: 297mm;
            position: relative;
        }
    `],
    directives: [DisplayElementComponent]
})

export class DisplayPageComponent  {

    @Input()
    page: Page;
        
    @ViewChildren(DisplayElementComponent)
    elementsComponents : QueryList<DisplayElementComponent>;
    
    saveContent(){
        console.log(this.elementsComponents);
        this.elementsComponents.toArray().forEach((child) => child.saveContent());
    }
}