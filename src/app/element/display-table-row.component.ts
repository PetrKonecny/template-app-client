import { Component, Input } from '@angular/core';
import { TableElement, Cell } from './table-element'
import { RowContent } from '../content/table-content'

@Component({
    selector: '[tr]',
    template: `

        <td *ngFor = "let cell of element.rows[y].cells; let x = index" 
            [style.width.px]="cell.width"
            [attr.colspan]=cell.colspan 
            [attr.rowspan]=cell.rowspan 
            [style.background-color]="cell.background_color ? cell.background_color : defaultBackgroundColor"
            [style.color]="cell.text_color ? cell.text_color : defaultTextColor" 
            [style.width.px]="cell.width" 
            [style.border-style]="cell.border_style" 
            [style.border-color]="cell.border_color ? cell.border_color : defaultBorderColor " 
            [style.border-width.px]="cell.border_width" >
            <textarea 
                [(ngModel)]="content.cells[x].text" 
                [style.color]="cell.text_color" 
                [style.text-align]="element.rows[y].cells[x].text_align"  
                [style.font-size.px]="element.rows[y].cells[x].font_size" 
                [class.italic]="element.rows[y].cells[x].italic" 
                [class.bold]="element.rows[y].cells[x].bold" 
                [style.font-family]="'font' + element.rows[y].cells[x].font?.id">
            </textarea>
        </td>
        `
    ,
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
    
    defaultBackgroundColor: string = Cell.defaultBackgroundColor
    defaultTextColor: string = Cell.defaultTextColor
    defaultBorderColor: string = Cell.defaultBorderColor
    
    @Input()
    y: number;
    
    x: number;
        
    @Input()
    content: RowContent
}
