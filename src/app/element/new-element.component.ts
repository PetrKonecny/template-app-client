import { Component, Input, KeyValueDiffer, KeyValueDiffers, DoCheck, HostListener } from '@angular/core';
import { Element } from './element'
import {StepSelector, StateChangeRespond} from '../step-selector'

@Component({
    selector: 'create-new-element',
    template: `
        <create-new-text-element  *ngIf="element.type == 'text_element'" [element] = "element"></create-new-text-element>
        <create-new-frame-element *ngIf="element.type == 'frame_element'" [element] = "element"></create-new-frame-element>
        <create-new-image-element *ngIf="element.type == 'image_element'" [element] = "element"></create-new-image-element>
        <create-new-table-element *ngIf="element.type == 'table_element'" [element] = "element"></create-new-table-element>
    `,
})

       
export class NewElementComponent implements DoCheck, StateChangeRespond{
    
    @Input()
    element : Element
    continuousChangeRunning : boolean = false
    differ: KeyValueDiffer;

    @HostListener('document:mouseup', ['$event'])
    onDocMouseUp(event) {
        if(this.element){
            this.element.changing = false
        }
    }

     constructor(
        private differs: KeyValueDiffers,
        private stateService: StepSelector
    ){
        this.differ = differs.find({}).create(null);
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