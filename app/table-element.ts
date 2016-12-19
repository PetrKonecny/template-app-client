import {Font} from './font';
import {Element} from './element'
 
export enum ClientState {moveResize,fillOut,editTable,editCells}

export class TableElement extends Element {
    font_size: number;
    type: string = 'table_element';
    font: Font;
    static default_cell_width: number = 100
    static default_row_height: number = 30
    rows: Array<Row>;
    selectedCells: Array<Cell>
    selectionWidth: number
    selectionHeight: number
    selectionStart: CellPosition
    selectionEnd: CellPosition
    clientState: ClientState = ClientState.moveResize 
    
    static addRows(element:TableElement, count: number, length: number, height: number = this.default_row_height, width: number = this.default_cell_width){
        if(!element.rows) element.rows = new Array()
        for(var i = 0; i<count; i++){
            var row = new Row()
            row.height = height
            Row.addCells(row,length,width)
            element.rows.push(row)
        }
    }
    
    static addCellToRows(element:TableElement, width: number = this.default_cell_width){
        for(var row of element.rows){
            var cell = new Cell
            cell.width = width
            row.cells.push(cell)
        }
    }
    
    static removeCellFromRows(element: TableElement){
        for(var row of element.rows){
            row.cells.pop()
        }
    }
    
    static selectCell(element: TableElement, cell: Cell){
        cell.selected = true
        if (!element.selectedCells){
            element.selectedCells = new Array
        }
        element.selectedCells.push(cell)
    }
    
    static clearSelectedCells(element: TableElement){
        element.rows.forEach((row)=> row.cells.forEach((cell) => cell.selected = false))
        element.selectedCells = new Array
    }
    
}


export class Row{
    cells: Array<Cell>;
    height: number
    
    static addCells (row: Row, count: number, width: number){
        if (!row.cells) row.cells = new Array()
        for(var i = 0; i<count; i++){
            var cell = new Cell()
            cell.width = width
            row.cells.push(cell)
        }
    }
}

export class Cell{
    width: number
    position: CellPosition
    originalPosition: CellPosition
    font: Font
    colspan: number
    rowspan: number
    font_size: number
    bold: boolean
    italic: boolean
    text_align: string
    vertical_align: string
    selected: boolean
    static defaultTextColor: string = "#000"
    text_color: string
    static defaultBackgroundColor: string = "#ccc"
    background_color: string
    border_style: string
    static defaultBorderColor: string = "#000"
    border_color: string
    border_width: number = 1
}

export class CellPosition {
    x: number
    y: number
}