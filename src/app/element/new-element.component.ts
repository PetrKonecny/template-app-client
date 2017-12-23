import { Component, Input, HostListener, ChangeDetectionStrategy } from '@angular/core';
import { Element, SelectElement } from './element';
import { Store } from '@ngrx/store'
import { AppState } from '../app.state'
import { changeMoreParamsOnObj } from '../normalizers'
import { ElementDimensions } from '../draggable.directive'
import { NewPageReference } from '../page/new-page.ref'

@Component({
    selector: 'create-new-element',
    template: `
            <element-handle [element]="element" [visible]="selected" *ngIf="element && element.type == 'text_element'" >
                <create-new-text-element *ngIf="element.type == 'text_element'" [element] = "element"></create-new-text-element>
            </element-handle>
            <element-handle [element]="element" [visible]="selected" *ngIf="element && element.type == 'frame_element'">
                <create-new-frame-element *ngIf="element.type == 'frame_element'" [element] = "element"></create-new-frame-element>
            </element-handle>
            <element-handle [element]="element" [visible]="selected" *ngIf="element && element.type == 'image_element'"> 
                <create-new-image-element *ngIf="element.type == 'image_element'" [element] = "element"></create-new-image-element>
            </element-handle>
            <create-new-table-element #handleContent *ngIf="element && element.type == 'table_element'" [element] = "element"></create-new-table-element>
        `,
    styles: [`
        .selected{border: 2px dashed blue}
    `],
    changeDetection: ChangeDetectionStrategy.OnPush
})

//Root element for displaying elements in template editor depending on their type and provides basic functionality
export class NewElementComponent {
    
    @Input()
    public element : Element
    @Input()
    public selected: boolean = false
    public subs = []
    public contents

    @HostListener('mousedown',['$event'])
    onMousedown(){
        this.store.dispatch(new SelectElement(this.element.id))
    } 

    ngOnInit(){
        this.subs.push(this.store.select('elements').subscribe(data => this.selected = data.selected === this.element.id))
        this.subs.push(this.store.select('contents').subscribe(data => this.contents = data.contents))
    }

    ngOnDestroy(){
        this.subs.forEach(sub => sub.complete())
    }

    move(dimensions: ElementDimensions){
       let d = this.newPage.move(this.element,dimensions)
        if(d){
            var obj = changeMoreParamsOnObj(
                this.element,
                'elements',
                ['positionX','positionY'],
                [this.element.positionX + d.left, this.element.positionY + d.top]
            )
            this.store.dispatch({type: "ADD_NORMALIZED_DATA", data: obj})
        }
    }

    constructor(
        public store: Store<AppState>,
        public newPage: NewPageReference
    ){
    }
}