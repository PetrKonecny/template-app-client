import { Component, Input, OnInit, HostListener} from '@angular/core';
import { NewTextElementComponent} from './new-text-element.component'
import { TableElement, Cell, Row, ClientState} from './table-element'
import { Draggable2, ElementDimensions} from './draggable2.directive'
import { Resizable } from './resizable.directive'
import { DisplayTableRowComponent } from './display-table-row.component'
import { ElementSelector } from './element-selector'
import { TableContent, CellContent, RowContent } from './table-content'

@Component({
    selector: 'display-table-element',
    template: `     
        <table class= "inner" [style.left.px] = "element.positionX" [style.top.px] = "element.positionY">
            <tr *ngFor="let row of element.rows; let i = index" [element]="element" [y]="i"  [content]="element.content.rows[i]" [style.height.px]="row.height"></tr>
        </table>     
        `,
    styles:[`
        .inner {
            position: absolute;
            overflow: hidden;         
            background-color: rgba(0, 0, 0, 0.25);
        }
        .locked {
            pointer-events: none;
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
})

       
export class DisplayTableElementComponent {
    
    @Input()
    element : TableElement
  
}