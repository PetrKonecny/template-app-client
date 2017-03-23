import { Component, Input, OnInit } from '@angular/core';
import { TableElement } from './table-element'
import { NewTableElement } from './new-table-element'

@Component({
    selector: 'display-table-element',
    template: `     
        <table class= "inner" [style.left.px] = "element.positionX" [style.top.px] = "element.positionY">
            <tr *ngFor="let row of element.rows; let i = index" [myTr]="element" [y]="i"  [content]="element.content.rows[i]" [style.height.px]="row.height"></tr>
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
    providers: [NewTableElement]
})

       
export class DisplayTableElementComponent implements OnInit {
    
    @Input()
    element : TableElement

    ngOnInit(){
        this.element.clientState = 1
    }
  
}