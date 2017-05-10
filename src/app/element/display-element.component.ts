import { Component, Input, HostListener} from '@angular/core';
import { Element} from './element';
import { ElementStore } from '../element/element.store'

@Component({
    selector: 'display-element',
    template: `
        <display-text-element *ngIf="element.type == 'text_element'" [element]="element"></display-text-element>
        <display-frame-element *ngIf="element.type == 'frame_element'" [element]="element"></display-frame-element>
        <display-image-element *ngIf="element.type == 'image_element'" [element]="element"></display-image-element>
        <display-table-element *ngIf="element.type == 'table_element'" [element]="element"></display-table-element>
    `,
})

//root of elements, displays different elements depending on their type and provides some basic functionality for each of them
export class DisplayElementComponent {

    @Input()
    element: Element;

    constructor( private elementStore: ElementStore){

    }

    @HostListener('mousedown',['$event'])
    onMousedown(){
        this.elementStore.changeElement(this.element)
    } 
    
}