import { Component, Input, OnInit, HostListener} from '@angular/core';
import { NewTextElementComponent} from './new-text-element.component'
import { NewImageElementComponent} from './new-image-element.component'
import { TableElement, Cell, Row } from './table-element'
import { Draggable2, ElementDimensions} from './draggable2.directive'
import { Resizable } from './resizable.directive'
import { NewTableRowComponent } from './new-table-row.component'
import { ElementSelector } from './element-selector'
import { TableContent, CellContent, RowContent } from './table-content'

@Component({
    selector: 'create-new-table-element',
    template: `
        <table *ngIf="element.locked && !element.editable" draggable2 resizable (resize)="resize($event)" (move)="move($event)" (click)="onElementClicked()" class= "inner" [style.left.px] = "element.positionX" [style.top.px] = "element.positionY">
            <tr *ngFor="let row of element.rows; let i = index" [element]="element" [y]="i" [style.height.px]="row.height" [content]="element.content.rows[i]" class="locked"></tr>
        </table>
        <table *ngIf="!element.locked || element.editable" class= "inner" [style.left.px] = "element.positionX" (click)="onElementClicked()"  [style.top.px] = "element.positionY">
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
    directives: [Draggable2,  NewTextElementComponent, NewImageElementComponent, NewTableRowComponent, Resizable ]
})

       
export class NewTableElementComponent implements OnInit{
    
    @Input()
    element : TableElement
    counter: number
    
    move(dimensions: ElementDimensions){
        this.element.positionX += dimensions.left
        this.element.positionY += dimensions.top 
    }
    
    resize(dimensions: ElementDimensions){
        if (dimensions.width){
            this.counter += dimensions.width
            if (this.counter > this.element.default_cell_width){
                for (var row of (<TableContent>this.element.content).rows){
                    row.cells.push(new CellContent)
                }
                this.element.cells.push(new Cell(this.element.default_cell_width))
                this.counter = 0
            } else if (this.counter < -this.element.default_cell_width){
                if (this.element.cells.length > 1){
                    for (var row of (<TableContent>this.element.content).rows){
                        row.cells.pop
                    }
                    this.element.cells.pop()
                }
                this.counter = 0
            }
        } else if (dimensions.height){
            var content = <TableContent> this.element.content
            this.counter += dimensions.height
            if (this.counter > this.element.default_row_height){
                var row = new RowContent;
                content.rows.push(row)
                row.addCells(this.element.cells.length)
                this.element.rows.push(new Row(this.element.default_row_height))
                this.counter = 0
            } else if (this.counter < -this.element.default_row_height){
                if (this.element.rows.length > 1){
                    this.element.rows.pop()
                    content.rows.pop()
                }
                this.counter = 0
            }
        }
        
    }
    
    @HostListener('mousedown', ['$event'])
    onMousedown(event) {
        this.counter = 0
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