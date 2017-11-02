import { Component, Input, HostListener } from '@angular/core';
import { Element, ElementCommands} from './element';
import {UndoRedoService} from '../undo-redo.service'
import { ElementStore } from '../element/element.store'

@Component({
    selector: 'create-new-element',
    template: `
            <element-handle [element]="element" *ngIf="element.type == 'text_element'" >
                <create-new-text-element #handleContent *ngIf="element.type == 'text_element'" [element] = "element"></create-new-text-element>
            </element-handle>
            <element-handle [element]="element" *ngIf="element.type == 'frame_element'">
                <create-new-frame-element #handleContent *ngIf="element.type == 'frame_element'" [element] = "element"></create-new-frame-element>
            </element-handle>
            <element-handle [element]="element" *ngIf="element.type == 'image_element'"> 
                <create-new-image-element #handleContent *ngIf="element.type == 'image_element'" [element] = "element"></create-new-image-element>
            </element-handle>
            <create-new-table-element #handleContent *ngIf="element.type == 'table_element'" [element] = "element"></create-new-table-element>
        `,
    styles: [`
        .selected{border: 2px dashed blue}
    `]
})

//Root element for displaying elements in template editor depending on their type and provides basic functionality
export class NewElementComponent {
    
    @Input()
    element : Element
    selected: boolean = false

    @HostListener('mousedown',['$event'])
    onMousedown(){
        this.elementStore.changeElement(this.element)
    } 

    constructor(
        private undoRedoService: UndoRedoService,
        private elementStore: ElementStore,
        private commands: ElementCommands,
    ){
        this.elementStore.element.subscribe(element =>this.selected = this.element == element)
    }
}