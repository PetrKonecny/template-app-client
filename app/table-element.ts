import {Font} from './font';
import {Element} from './element'
 
export enum ClientState {moveResize,fillOut,editTable,editCells}

export class TableElement extends Element {
    font_size: number;
    type: string = 'table_element';
    font: Font;
    default_cell_width: number = 100
    default_row_height: number = 30
    rows: Array<Row>;
    selectedCells: Array<Cell>
    clientState: ClientState = ClientState.moveResize 
    
    addRows(count: number, length: number, height: number = this.default_row_height, width: number = this.default_cell_width){
        if(!this.rows) this.rows = new Array()
        for(var i = 0; i<count; i++){
            var row = new Row()
            row.height = height
            row.addCells(length,width)
            this.rows.push(row)
        }
    }
    
    addCellToRows(width: number = this.default_cell_width){
        for(var row of this.rows){
            var cell = new Cell
            cell.width = width
            row.cells.push(cell)
        }
    }
    
    removeCellFromRows(){
        for(var row of this.rows){
            row.cells.pop()
        }
    }
    
    selectCell(cell: Cell){
        cell.selected = true
        this.selectedCells.push(cell)
    }
    
    clearSelectedCells(){
        this.selectedCells.forEach((cell) => cell.selected = false)
        this.selectedCells = new Array
    }
    
}


export class Row{
    cells: Array<Cell>;
    height: number
    
    addCells (count: number, width: number){
        if (!this.cells) this.cells = new Array()
        for(var i = 0; i<count; i++){
            var cell = new Cell()
            cell.width = width
            this.cells.push(cell)
        }
    }
}

export class Cell{
    width: number
    font: Font
    font_size: number
    selected: boolean
}