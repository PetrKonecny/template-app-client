import { Component, Input, OnInit} from '@angular/core';
import { NewTextElementComponent} from './new-text-element.component'
import { NewImageElementComponent} from './new-image-element.component'
import { TableElement } from './table-element'
import { Draggable} from './draggable.directive'

@Component({
    selector: 'create-new-table-element',
    template: `
        <table draggable (click)="onElementClicked()" class= "inner" [style.width.px]="element.width" [style.height.px]="element.row_height * element.table_height" [style.left.px] = "element.positionX" [style.top.px] = "element.positionY">
            <tr *ngFor="let number of numberOfRows">
                <td *ngFor = "let number2 of numberOfColumns" [style.height.px] = "element.row_height"></td>
            </tr>
        </table>
        ,`,
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
            width: 100%;
        }
        table, td {
            border: 1px solid black;
            border-collapse: collapse;
        }`
    ],
    directives: [Draggable, NewTextElementComponent, NewImageElementComponent]
})

       
export class NewTableElementComponent implements OnInit{
    
    @Input()
    element : TableElement
  
    numberOfRows = new Array();
    numberOfColumns = new Array();
    
    fillFromDOM(){
    }    
    
    ngOnInit(){
        this.numberOfRows = new Array(this.element.table_height).fill(1);
        this.numberOfColumns = new Array(this.element.table_width).fill(1);
    }
}