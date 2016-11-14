import { Component, Input, OnInit} from '@angular/core';
import { NewTextElementComponent} from './new-text-element.component'
import { NewImageElementComponent} from './new-image-element.component'
import { TableElement } from './table-element'
import { Draggable2, ElementDimensions} from './draggable2.directive'
import { NewTableRowComponent } from './new-table-row.component'
import { ElementSelector } from './element-selector'

@Component({
    selector: 'create-new-table-element',
    template: `
        <table *ngIf="element.locked" draggable2 (move)="move($event)" (click)="onElementClicked()" class= "inner" [style.left.px] = "element.positionX" [style.top.px] = "element.positionY">
            <tr *ngFor="let row of element.rows; let i = index" [element]="element" [y]="i" [style.height.px]="row.height"></tr>
        </table>
        <table *ngIf="!element.locked" class= "inner" [style.left.px] = "element.positionX" [style.top.px] = "element.positionY">
            <tr *ngFor="let row of element.rows; let i = index" [element]="element" [y]="i" [style.height.px]="row.height"></tr>
        </table>
        `,
    styles:[`
        .inner {
            position: absolute;
            overflow: hidden;         
            background-color: rgba(0, 0, 0, 0.25);
        }
        .button{
            z-index: 1000;
            position: absolute;
            margin-right: 10px;
        }
        table {
            table-layout: fixed;
        }
        table, td {
            border: 1px solid black;
            border-collapse: collapse;
        }
        td {
            border: 1px solid black;
        }`
    ],
    directives: [Draggable2,  NewTextElementComponent, NewImageElementComponent, NewTableRowComponent ]
})

       
export class NewTableElementComponent implements OnInit{
    
    @Input()
    element : TableElement
    
    move(dimensions: ElementDimensions){
        this.element.positionX += dimensions.left
        this.element.positionY += dimensions.top 
    }
    
    constructor (private elementSelector: ElementSelector){}
    
    onElementClicked(){
        this.elementSelector.changeElement(this.element)
    }
  
    fillFromDOM(){
    }    
    
    ngOnInit(){
    }
}