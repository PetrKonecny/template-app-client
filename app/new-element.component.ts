import { Component, Input, ViewChild} from '@angular/core';
import { NewTextElementComponent} from './new-text-element.component'
import { NewImageElementComponent} from './new-image-element.component'
import { NewTableElementComponent} from './new-table-element.component'
import { Element } from './element'

@Component({
    selector: 'create-new-element',
    template: `
        <create-new-text-element  *ngIf="element.type == 'text_element'" [element] = "element"></create-new-text-element>
        <create-new-image-element *ngIf="element.type == 'image_element'" [element] = "element"></create-new-image-element>\n\
        <create-new-table-element *ngIf="element.type == 'table_element'" [element] = "element"></create-new-table-element>
    `,
    directives: [NewTextElementComponent, NewImageElementComponent, NewTableElementComponent]
})

       
export class NewElementComponent {
    
    @Input()
    element : Element
      
}