import { Component, Input, OnInit} from '@angular/core';
import { NewTextElementComponent} from './new-text-element.component'
import { NewImageElementComponent} from './new-image-element.component'
import { TableElement } from './table-element'
import { Draggable} from './draggable.directive'
import { NewTableRowComponent } from './new-table-row.component'

@Component({
    selector: 'create-new-table-element',
    template: `
        <table draggable (click)="onElementClicked()" class= "inner" [style.width.px]="element.width" [style.height.px]="element.row_height * element.table_height" [style.left.px] = "element.positionX" [style.top.px] = "element.positionY">
            <tr *ngFor="let height of heights" [height]="height" [widths]="widths" [style.height.px]="height"></tr>
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
            width: 100%;\n\
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
    directives: [Draggable, NewTextElementComponent, NewImageElementComponent, NewTableRowComponent ]
})

       
export class NewTableElementComponent implements OnInit{
    
    @Input()
    element : TableElement
  
    numberOfRows = new Array();
    numberOfColumns = new Array();
    
    widths = new Array();
    heights = new Array();
    
    fillFromDOM(){
    }    
    
    ngOnInit(){
        this.numberOfRows = new Array(this.element.table_height).fill(1);
        this.numberOfColumns = new Array(this.element.table_width).fill(1);
        this.widths = [30,60,90,120,150];
        this.heights = [20,40,60,80,100];
    }
}