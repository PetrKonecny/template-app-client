import { Component, Input, KeyValueDiffer, KeyValueDiffers, DoCheck, HostListener } from '@angular/core';
import { Element } from './element'
import {StepSelector, StateChangeRespond} from '../step-selector'
import { ElementSelector } from './element-selector'

@Component({
    selector: 'create-new-element',
    template: `
            <element-handle *ngIf="element.type == 'text_element'" >
                <create-new-text-element #handleContent *ngIf="element.type == 'text_element'" [element] = "element"></create-new-text-element>
            </element-handle>
            <element-handle *ngIf="element.type == 'frame_element'">
                <create-new-frame-element #handleContent *ngIf="element.type == 'frame_element'" [element] = "element"></create-new-frame-element>
            </element-handle>
            <element-handle *ngIf="element.type == 'image_element'"> 
                <create-new-image-element #handleContent *ngIf="element.type == 'image_element'" [element] = "element"></create-new-image-element>
            </element-handle>
            <create-new-table-element #handleContent *ngIf="element.type == 'table_element'" [element] = "element"></create-new-table-element>
        `,
    styles: [`
        .selected{border: 2px dashed blue}
    `]
})

       
export class NewElementComponent implements DoCheck, StateChangeRespond{
    
    @Input()
    element : Element
    continuousChangeRunning : boolean = false
    differ: KeyValueDiffer;
    selected: boolean = false

    @HostListener('mousedown',['$event'])
    onMousedown(){
        this.elementSelector.changeElement(this.element)
    } 

    @HostListener('document:mouseup', ['$event'])
    onDocMouseUp(event) {
        if(this.element){
            this.element.changing = false
        }
    }

     constructor(
        private differs: KeyValueDiffers,
        private stateService: StepSelector,
        private elementSelector: ElementSelector
    ){
        this.differ = differs.find({}).create(null);
        this.elementSelector.element.subscribe(element =>this.selected = this.element == element)
    }

    getSubject(){
        return this.element
    }

    ngDoCheck(){
        var changes = this.differ.diff(this.element);
        if(changes) {
            this.stateService.respond(changes,this)           
        }
        
    }

      
}