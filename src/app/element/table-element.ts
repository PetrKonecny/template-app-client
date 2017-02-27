import {Font} from '../font/font';
import {Element} from './element'
import {TableContent} from '../content/table-content'

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

    static addRows(element:TableElement, count: number = 1, length: number, height: number = this.default_row_height, width: number = this.default_cell_width, position: number = 0){
        if(!element.content){
            element.content = new TableContent
        }
        TableContent.addRows(<TableContent> element.content,length,count,position)
        if(!element.rows) element.rows = new Array()
        for(var i = 0; i<count; i++){
            var row = new Row()
            row.height = height
            Row.addCells(row,length,width)
            element.rows.splice(position, 0, row)
        }
    }

    static addColumns(element:TableElement, count: number = 1, height: number = this.default_row_height, width: number = this.default_cell_width, position: number = 0){
        if(!element.content){
            element.content = new TableContent
        }
        TableContent.addColumns(<TableContent>element.content, count, position)
        element.rows.forEach(row =>{
            Row.addCells(row,1,width,position)

        })
    }

    static getRowCellWidth(row: Row){
        let total = 0
        row.cells.forEach((cell)=>{
            if(cell.colspan > 0){
                total += cell.colspan
            }else{
                total ++
            }
        })
        return total
    }

    static deleteRow(element: TableElement, cell: Cell){
        let position = TableElement.getCellPosition(element,cell)
        let content = <TableContent> element.content
        element.rows.splice(position.y,1)
        content.rows.splice(position.y,1)
    }

    static deleteColumn(element: TableElement, cell: Cell){
        let position = TableElement.getCellPosition(element,cell)
        let content = <TableContent> element.content
        element.rows.forEach(row =>{
            row.cells.splice(position.x,1)
        })
        content.rows.forEach(row =>{
            row.cells.splice(position.x,1)
        })

    }

    static addRowAbove(element: TableElement, cell: Cell){
        let position = TableElement.getCellPosition(element,cell)
        let length = TableElement.getRowCellWidth(element.rows[position.y])
        TableElement.addRows(element,undefined,length,undefined, undefined,position.y)
    }

    static addColumnLeft(element: TableElement, cell: Cell){
        let position = TableElement.getCellPosition(element,cell)
        let length = TableElement.getRowCellWidth(element.rows[position.y])
        TableElement.addColumns(element,undefined,undefined, undefined,position.x)
    }

    static addColumnRight(element: TableElement, cell: Cell){
        let position = TableElement.getCellPosition(element,cell)
        let length = TableElement.getRowCellWidth(element.rows[position.y])
        let x = cell.colspan? cell.colspan : 1
        TableElement.addColumns(element,undefined,undefined, undefined,position.x + x)
    }

    static addRowBelow(element: TableElement, cell: Cell){
        let position = TableElement.getCellPosition(element,cell)
        let length = TableElement.getRowCellWidth(element.rows[position.y])
        let y = cell.rowspan? cell.rowspan : 1
        TableElement.addRows(element,undefined,length,undefined, undefined,position.y + y)
    }

    static getCellPosition(element: TableElement, cell: Cell){
        let x = -1
        let y = -1 
        element.rows.forEach((row,indexRow)=>{
            row.cells.forEach((cell2,indexCell)=>{
                if(cell2 === cell){
                    x = indexCell
                    y = indexRow
                }
            })
        })
        if(x > -1 && y > -1){
            let cellPos = new CellPosition
            cellPos.x = x
            cellPos.y = y
            return cellPos
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
    
    static addCells (row: Row, count: number, width: number, position: number = 0){
        if (!row.cells) row.cells = new Array()
        for(var i = 0; i<count; i++){
            var cell = new Cell()
            cell.width = width
            row.cells.splice(position,0,cell)
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
    static defaultBackgroundColor: string = "#f5f5f5"
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