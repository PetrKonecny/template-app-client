import { Component, Input } from '@angular/core';
import { Element } from './element'

@Component({
    selector: 'create-new-element',
    template: `
        <create-new-text-element  *ngIf="element.type == 'text_element'" [element] = "element"></create-new-text-element>
        <create-new-frame-element *ngIf="element.type == 'frame_element'" [element] = "element"></create-new-frame-element>
        <create-new-image-element *ngIf="element.type == 'image_element'" [element] = "element"></create-new-image-element>
        <create-new-table-element *ngIf="element.type == 'table_element'" [element] = "element"></create-new-table-element>
    `,
})

       
export class NewElementComponent {
    
    @Input()
    element : Element
      
}