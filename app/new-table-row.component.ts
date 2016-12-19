import { Component, Input, OnInit, HostListener} from '@angular/core';
import { NewTableCellComponent } from './new-table-cell.component'
import { TableElement, Cell } from './table-element'
import { RowContent } from './table-content'
import { Resizable } from './resizable.directive' 
import { NewTableElement } from './new-table-element'

@Component({
    selector: 'tr',
    template: `

                <template [ngIf]="element.clientState == 0">
                    <td *ngFor = "let cell of element.rows[y].cells; let x = index" 
                        [attr.colspan]=cell.colspan 
                        [attr.rowspan]=cell.rowspan 
                        [style.background-color]="cell.background_color ? cell.background_color : defaultBackgroundColor"
                        [style.color]="cell.text_color ? cell.text_color : defaultTextColor" 
                        [style.width.px]="cell.width" 
                        [style.text-align]="element.rows[y].cells[x].text_align"  
                        [class.italic]="element.rows[y].cells[x].italic" 
                        [class.bold]="element.rows[y].cells[x].bold" 
                        [style.font-size.px]="element.rows[y].cells[x].font_size"  
                        [style.border-style]="cell.border_style" 
                        [style.border-color]="cell.border_color ? cell.border_color : defaultBorderColor " 
                        [style.border-width.px]="cell.border_width" 
                        [style.vertical-align]="element.rows[y].cells[x].vertical_align" 
                        [style.font-family]="'font' + element.rows[y].cells[x].font?.id"
                    >{{content.cells[x].text}}</td> 
                </template>
                <template [ngIf]="element.clientState == 2">
                    <td *ngFor = "let cell of element.rows[y].cells; let x = index" 
                        [attr.colspan]=cell.colspan 
                        [attr.rowspan]=cell.rowspan (mousedown)="onMousedown(x)" 
                        [style.width.px]="cell.width" resizable (resize)="resize($event)" 
                        [style.background-color]="cell.background_color ? cell.background_color : defaultBackgroundColor"
                        [style.color]="cell.text_color ? cell.text_color : defaultTextColor" 
                        [style.text-align]="element.rows[y].cells[x].text_align" 
                        [class.italic]="element.rows[y].cells[x].italic"  
                        [style.border-style]="cell.border_style" 
                        [style.border-color]="cell.border_color ? cell.border_color : defaultBorderColor " 
                        [style.border-width.px]="cell.border_width"  
                        [class.bold]="element.rows[y].cells[x].bold" 
                        [style.font-size.px]="element.rows[y].cells[x].font_size" 
                        [style.vertical-align]="element.rows[y].cells[x].vertical_align" 
                        [style.font-family]="'font' + element.rows[y].cells[x].font?.id"
                    >{{content.cells[x].text}}</td> 
                </template>
                <template [ngIf]="element.clientState == 3">
                    <td *ngFor = "let cell of element.rows[y].cells; let x = index" 
                        [attr.colspan]=cell.colspan 
                        [attr.rowspan]=cell.rowspan 
                        (mousedown)="onMousedownSelect($event,cell)" 
                        (mouseover)="onMouseover($event,cell)" 
                        [style.background-color]="cell.background_color ? cell.background_color : defaultBackgroundColor"
                        [style.color]="cell.text_color ? cell.text_color : defaultTextColor" 
                        [style.width.px]="cell.width"  
                        [style.border-style]="cell.border_style" 
                        [style.border-color]="cell.border_color ? cell.border_color : defaultBorderColor " 
                        [style.border-width.px]="cell.selected ? getSelectedBorderWidth(cell) : cell.border_width" 
                        [style.text-align]="element.rows[y].cells[x].text_align"  
                        [class.italic]="element.rows[y].cells[x].italic" 
                        [class.bold]="element.rows[y].cells[x].bold" 
                        [style.font-size.px]="element.rows[y].cells[x].font_size" 
                        [style.vertical-align]="element.rows[y].cells[x].vertical_align" 
                        [style.font-family]="'font' + element.rows[y].cells[x].font?.id"
                    >{{content.cells[x].text}}</td> 
                </template>
                <template [ngIf]="element.clientState == 1">
                    <td *ngFor = "let cell of element.rows[y].cells; let x = index" 
                        [attr.colspan]=cell.colspan 
                        [attr.rowspan]=cell.rowspan 
                        [style.background-color]="cell.background_color ? cell.background_color : defaultBackgroundColor"
                        [style.color]="cell.text_color ? cell.text_color : defaultTextColor" 
                        [style.width.px]="cell.width" 
                        [style.border-style]="cell.border_style" 
                        [style.border-color]="cell.border_color ? cell.border_color : defaultBorderColor " 
                        [style.border-width.px]="cell.border_width">
                        <textarea  *ngIf="element.clientState == 1" 
                            [(ngModel)]="content.cells[x].text"  
                            [style.color]="cell.text_color" 
                            [style.text-align]="element.rows[y].cells[x].text_align"  
                            [style.font-size.px]="element.rows[y].cells[x].font_size" 
                            [class.italic]="element.rows[y].cells[x].italic" 
                            [class.bold]="element.rows[y].cells[x].bold" 
                            [style.font-family]="'font' + element.rows[y].cells[x].font?.id">
                    </textarea>
                </td>
                </template>
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

       
export class NewTableRowComponent implements OnInit{
    
    @Input()
    element: TableElement;
    
    @Input()
    y: number;
    
    x: number;
    
    selecting: boolean
    
    defaultBackgroundColor: string = Cell.defaultBackgroundColor
    defaultTextColor: string = Cell.defaultTextColor
    defaultBorderColor: string = Cell.defaultBorderColor
    
    @Input()
    content: RowContent
    
    constructor(private tableElement: NewTableElement){}
    
    @HostListener('document:mouseup', ['$event'])
    onDocMouseup(event) {    
        this.selecting = false
    }

    @HostListener('document:mousedown', ['$event'])
    onDocMousedown(event) {
        this.selecting = true
    }
    
    onMouseover(event: MouseEvent, cell: Cell) {
        let x = this.element.rows[this.y].cells.indexOf(cell)
        /*
        if (this.selecting){
            if (!this.element.selectedCells) {
                this.element.selectedCells = new Array()
            }
            var cell = this.element.rows[this.y].cells[this.x]
            if (!cell.selected){
                TableElement.selectCell(this.element,cell)
            }
        }*/
        if (this.selecting){
            this.tableElement.continueSelection(cell,x,this.y)
        }
    }
    
    resize(dimensions: any){
        if(dimensions.width){
            for (var row of this.element.rows){
                row.cells[this.x].width += dimensions.width
            }
        }else if(dimensions.height){
            this.element.rows[this.y].height += dimensions.height
        }
    }
    
    onMousedown(x: number){
        this.x = x
    }
    
    getSelectedBorderWidth(cell: Cell){
        let width: number = +cell.border_width
        return width + 1
    }
    
    onMousedownSelect(event: MouseEvent,cell: Cell){
        let x = this.element.rows[this.y].cells.indexOf(cell)
        this.tableElement.startSelection(this.element.rows[this.y].cells[x],x,this.y)
        event.preventDefault()
    }
    
    shadeRGBColor(color, percent) {
        var f=color.split(","),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=parseInt(f[0].slice(4)),G=parseInt(f[1]),B=parseInt(f[2]);
        return "rgb("+(Math.round((t-R)*p)+R)+","+(Math.round((t-G)*p)+G)+","+(Math.round((t-B)*p)+B)+")";
    }
    
    shadeHEXColor(color, percent) {   
        var f=parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
        return "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
    }

    
    fillFromDOM(){
    }    
    
    ngOnInit(){    
    }
}
