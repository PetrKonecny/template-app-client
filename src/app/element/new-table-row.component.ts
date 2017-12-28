import { Component, Input, OnInit, HostListener} from '@angular/core';
import { TableElement, Cell, SetColumnWidth2, SetRowHeight2 } from './table-element'
import { RowContent } from '../content/table-content'
import { NewTableElementReference } from './new-table-element.ref'
import { Store } from '@ngrx/store'
import { AppState } from '../app.state'

@Component({
    selector: '[myTr]',
    template: `

                <!-- template for row when moving element -->

                <template [ngIf]="element.clientState == 0">
                    <td *ngFor = "let cell of element.rows[y].cells; let x = index" 
                        [attr.colspan]=cell.colspan 
                        [attr.rowspan]=cell.rowspan 
                        [style.background]="cell.background_color ? cell.background_color : 'none'"
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
                    >{{content?.cells[x].text}}</td> 
                </template>

                <!-- template for row when editing table structure -->

                <template [ngIf]="element.clientState == 2">
                    <td *ngFor = "let cell of element?.rows[y].cells; let x = index" 
                        [attr.colspan]=cell.colspan 
                        [attr.rowspan]=cell.rowspan 
                        (mousedown)="onMousedownEdit(x, cell)" 
                        [style.width.px]="cell.width"
                        [style.background]="getCellBGColor(cell)"
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
                    ><div style ="position: relative; height: 100%;">{{content?.cells[x].text}}

                <a draggable2 *ngIf="cell.selected" (move)="left($event)" style="left: 0; top: 50%;"></a>
                <a draggable2 *ngIf="cell.selected" (move)="right($event)" style="top: 50%; left: 100%;"></a>
                <a draggable2 *ngIf="cell.selected" (move)="top($event)" style="left: 50%; top:0;"></a>
                <a draggable2 *ngIf="cell.selected" (move)="bottom($event)" style="left: 50%; top: 100%;"></a>
                    </div></td> 
                </template>

                <!-- template for row when changing cell parameters -->

                <template [ngIf]="element.clientState == 3">
                    <td *ngFor = "let cell of element.rows[y].cells; let x = index" 
                        [attr.colspan]=cell.colspan 
                        [attr.rowspan]=cell.rowspan 
                        (mousedown)="onMousedownSelect($event,cell)" 
                        (mouseover)="onMouseover($event,cell)" 
                        [style.background]="getCellBGColor(cell)"
                        [style.color]="cell.text_color ? cell.text_color : defaultTextColor" 
                        [style.width.px]="cell.width"  
                        [style.border-style]="cell.border_style" 
                        [style.border-color]="cell.border_color ? cell.border_color : defaultBorderColor " 
                        [style.border-width.px]="cell.border_width" 
                        [style.text-align]="element.rows[y].cells[x].text_align"  
                        [class.italic]="element.rows[y].cells[x].italic" 
                        [class.bold]="element.rows[y].cells[x].bold" 
                        [style.font-size.px]="element.rows[y].cells[x].font_size" 
                        [style.vertical-align]="element.rows[y].cells[x].vertical_align" 
                        [style.font-family]="'font' + element.rows[y].cells[x].font?.id"
                    >{{content?.cells[x].text}}</td> 
                </template>

                <!-- template for row when filling out the table -->

                <template [ngIf]="element.clientState == 1">
                    <td *ngFor = "let cell of element.rows[y].cells; let x = index" 
                        [attr.colspan]=cell.colspan 
                        [attr.rowspan]=cell.rowspan 
                        [style.background]="cell.background_color ? cell.background_color : 'none'"
                        [style.color]="cell.text_color ? cell.text_color : defaultTextColor"
                        [style.width.px]="cell.width" 
                        [style.border-style]="cell.border_style" 
                        [style.border-color]="cell.border_color ? cell.border_color : defaultBorderColor " 
                        [style.border-width.px]="cell.border_width">
                        <textarea  *ngIf="element.clientState == 1" 
                            [value]="content?.cells[x].text"  
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
        a {z-index: 1000; position: absolute; margin: -6px; border-radius: 50%; width: 12px; height: 12px; background: blue;}
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

//displays table row in template editor        
export class NewTableRowComponent {
    
    @Input('myTr')
    //element that contains row that should be displayed
    element: TableElement;
    
    //pcoordinate ofthe row that should be displayed
    @Input()
    y: number;

    x: number;
        
    //true if cells are being selected false otherwise
    selecting: boolean
    
    //default colors for the cells
    defaultBackgroundColor: string = Cell.defaultBackgroundColor
    defaultTextColor: string = Cell.defaultTextColor
    defaultBorderColor: string = Cell.defaultBorderColor
    
    @Input()
    //content that contains content for this row
    content: RowContent
    
    /***
    @param tableElement - reference to the table element used for selectiong
    */
    constructor(public store: Store<AppState>, private tableElement: NewTableElementReference){}
    
    @HostListener('document:mouseup', ['$event'])
    onDocMouseup(event) {    
        this.selecting = false
    }

    @HostListener('document:mousedown', ['$event'])
    onDocMousedown(event) {
        this.selecting = true
    }
    
    /** called when mouse is over the cell 
    @param event - mouse event fired on mouse over the cell
    @param cell - cell that was moused over
    **/
    onMouseover(event: MouseEvent, cell: Cell) {
        let x = this.element.rows[this.y].cells.indexOf(cell)
        if (this.selecting){
            this.tableElement.continueSelection(cell,x,this.y)
        }
    }
    
    //THIS SHOULD BE DONE BY COMMAND
    resize(dimensions: any, cell: Cell){
        if(dimensions.width){
            for (var row of this.element.rows){
                row.cells[this.x].width += dimensions.width
            }
        }else if(dimensions.height){
            this.element.rows[this.y].height += dimensions.height
        }
    }
    
    /**calls mousedown in editing mode
    @param x - x coordinate of the cell
    @param cell - cell that was selected
    **/
    onMousedownEdit(x: number, cell: Cell){
        TableElement.clearSelectedCells(this.element)
        TableElement.selectCell(this.element, cell)
        this.x = x
    }
    
    //gets appearance of selected cells border width
    getSelectedBorderWidth(cell: Cell){
        let width: number = +cell.border_width
        return width + 1
    }

    //gets different cell background color if cell is selected or not
    getCellBGColor(cell){
        if(cell.selected){
            if(cell.background_color){
                return this.shadeHEXColor(cell.background_color, 0.5)
            } else{
                return "#ffd740";
            }
        }
        else if(cell.background_color){
            return cell.background_color
        }
        else{
            return 'none'
        }

    }
    
    //calls when selecting cells
    onMousedownSelect(event: MouseEvent,cell: Cell){
        let x = this.element.rows[this.y].cells.indexOf(cell)
        this.tableElement.startSelection(this.element.rows[this.y].cells[x],x,this.y)
        event.preventDefault()
    }
    
    //helper function to shade color to appear as selected
    shadeRGBColor(color, percent) {
        var f=color.split(","),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=parseInt(f[0].slice(4)),G=parseInt(f[1]),B=parseInt(f[2]);
        return "rgb("+(Math.round((t-R)*p)+R)+","+(Math.round((t-G)*p)+G)+","+(Math.round((t-B)*p)+B)+")";
    }
    
    //helper function to shade color to appear as selected
    shadeHEXColor(color, percent) {   
        var f=parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
        return "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
    }

    
    fillFromDOM(){
    }    
    
    /**
    calls the command to resize the column
    @param dimensions - dimensions used to resize the column
    **/
    left(dimensions){
        this.store.dispatch(new SetColumnWidth2(this.element,dimensions,this.x));
    }

    /**
    calls the command to resize the column
    @param dimensions - dimensions used to resize the column
    **/
    right(dimensions){
        this.store.dispatch(new SetColumnWidth2(this.element,dimensions,this.x));
    }

    /**
    calls the command to resize the row
    @param dimensions - dimensions used to resize the row
    **/
    top(dimensions){
        this.store.dispatch(new SetRowHeight2(this.element,dimensions,this.y));
    }

    /**
    calls the command to resize the row
    @param dimensions - dimensions used to resize the row
    **/
    bottom(dimensions){
        this.store.dispatch(new SetRowHeight2(this.element,dimensions,this.y));
    }

}
