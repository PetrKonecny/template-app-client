import { Component, Input, OnInit, HostListener} from '@angular/core';
import { NewTableCellComponent } from './new-table-cell.component'
import { TableElement } from './table-element'
import { RowContent } from './table-content'
import { Resizable } from './resizable.directive' 

@Component({
    selector: 'tr',
    template: `

        <td *ngFor = "let cell of element.rows[y].cells; let x = index" [style.width.px]="cell.width"><textarea [(ngModel)]="content.cells[x].text" [style.text-align]="element.rows[y].cells[x].text_align"  [style.font-size.px]="element.rows[y].cells[x].font_size" [class.italic]="element.rows[y].cells[x].italic" [class.bold]="element.rows[y].cells[x].bold" [style.font-family]="'font' + element.rows[y].cells[x].font?.id"></textarea></td>
        `
    ,
    directives: [Resizable], 
    styles: [`
        textarea{
            resize: none;
            background: none;
            border: none;
            width: 100%;
            height: inherit;
            overflow: hidden;
            font-family: inherit;
            margin: 0;
            font-size: inherit;
            text-align: inherit;
            -webkit-box-sizing: border-box; /* <=iOS4, <= Android  2.3 */
            -moz-box-sizing: border-box; /* FF1+ */
            box-sizing: border-box; /* Chrome, IE8, Opera, Safari 5.1*/
        }
        td {
            height: inherit;
            padding: 0;
            border: 1px solid black;
            border-collapse: collapse;
        }
        .selected{
            background-color: yellow;
        }
        .bold{
            font-weight: bold;
        }
        .italic{
            font-style: italic;
        }
    `]
})

       
export class DisplayTableRowComponent {
    
    @Input()
    element: TableElement;
    
    @Input()
    y: number;
    
    x: number;
        
    @Input()
    content: RowContent
}
