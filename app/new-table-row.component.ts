import { Component, Input, OnInit} from '@angular/core';
import { NewTableCellComponent } from './new-table-cell.component'
import { TableElement } from './table-element'

@Component({
    selector: 'tr',
    template: `
                <td *ngFor = "let cell of element.cells; let i = index" [element]="element" [y]="y" [x]="i" [style.width.px]="cell.width"></td>
        `
    ,
    directives: [NewTableCellComponent], 
    styles: [`
        td {
            height: inherit;
            border: 1px solid black;
            border-collapse: collapse;\n\
        }
    `]
})

       
export class NewTableRowComponent implements OnInit{
    
    @Input()
    element: TableElement;
    
    @Input()
    y: number;
    
    
    fillFromDOM(){
    }    
    
    ngOnInit(){
      
    }
}
