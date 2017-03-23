import {Font} from '../font/font';
import {Element} from './element'
import {TableContent, RowContent, CellContent} from '../content/table-content'
export enum ClientState {moveResize,fillOut,editTable,editCells}
import {UndoRedoService, Command} from '../undo-redo.service'
import {Injectable} from '@angular/core';

/* Extending this command should allow rollback funcionality for
most table commands, however it is not the most optimal solution
when performance is a concern (for example with larger tables) custon unExecute method 
should be implemented instead
*/
@Injectable()
export class TableElementCommands{

    constructor(private service: UndoRedoService){}


    addRowAbove(element: TableElement, cell: Cell){
        this.service.execute(new AddRowAbove(element,cell))
    }

    addRowBelow(element: TableElement, cell: Cell){
        this.service.execute(new AddRowBelow(element,cell))
    }

    addColumnLeft(element: TableElement, cell: Cell){
        this.service.execute(new AddColumnLeft(element,cell))
    }

    addColumnRight(element: TableElement, cell: Cell){
        this.service.execute(new AddColumnRight(element,cell))
    }

    deleteRow(element: TableElement, cell: Cell){
        this.service.execute(new DeleteRow(element,cell))
    }

    deleteColumn(element: TableElement, cell: Cell){
        this.service.execute(new DeleteColumn(element,cell))
    }

    mergeSCells(element: TableElement){
        this.service.execute(new mergeSCells(element))
    }

    changeSCellsBold(element: TableElement){
        this.service.execute(new changeSCellsBold(element))
    }

    changeSCellsItalic(element: TableElement){
        this.service.execute(new changeSCellsItalic(element))
    }

    changeSCellsBorderW(element: TableElement, width: number){
        this.service.execute(new changeSCellsParam(element,"border_width",width))
    }

    changeSCellsBorderStyle(element: TableElement, style: string){
        this.service.execute(new changeSCellsParam(element,"border_style",style))
    }

    changeSCellsBorderColor(element: TableElement, color: string){
        this.service.execute(new changeSCellsParam(element,"border_color",color))
    }

    changeSCellsBackgroundColor(element: TableElement, color: string){
        this.service.execute(new changeSCellsParam(element,"background_color",color))
    }

    toggleSCellsBackground(element: TableElement, value: boolean){
        if(value){
            this.service.execute(new changeSCellsParam(element,"background_color",Element.defaultBackgroundColor))
        }else{
            this.service.execute(new changeSCellsParam(element,"background_color",null))
        }
    }

    changeSCellsTextAlign(element: TableElement, align: string){
        this.service.execute(new changeSCellsParam(element,"text_align",align))
    }

    changeSCellsTextAlignVert(element: TableElement, align: string){
        this.service.execute(new changeSCellsParam(element,"vertical_align",align))
    }

    changeSCellsFontSize(element: TableElement, size: number){
        this.service.execute(new changeSCellsParam(element,"font_size",size))
    }

    changeSCellsTextColor(element: TableElement, color: string){
        this.service.execute(new changeSCellsParam(element,"text_color",color))
    }

    ChangeSCellsFont(element: TableElement, font: Font){
        this.service.execute(new ChangeSCellsFont(element,font))
    }
}


export class DefaultTableCommand implements Command{

    constructor(public element: TableElement){}
    rowString: string
    contentString: string

    execute(){
        this.rowString = JSON.stringify(this.element.rows)
        let content = <TableContent> this.element.content
        this.contentString = JSON.stringify(content.rows)
    }

    unExecute(){
        this.element.rows = JSON.parse(this.rowString)
        let content = <TableContent> this.element.content
        content.rows = JSON.parse(this.contentString)
    }

}

/*Executing this command adds new row with content in cells to the
given element above the given cell
*/
export class AddRowAbove extends DefaultTableCommand{

    constructor(public element: TableElement, private cell: Cell){
        super(element)
    }

    execute(){
        super.execute()
        let position = TableElement.getCellPosition(this.element,this.cell)
        let length = TableElement.getRowCellWidth(this.element.rows[position.y])
        TableElement.addRows(this.element,undefined,length,undefined, undefined, position.y )
    }   
}

/*Executing this command adds new row with content in cells to the 
given element below the given cell
*/
export class AddRowBelow extends DefaultTableCommand{

    constructor(public element: TableElement, private cell: Cell){
        super(element)
    }

    execute(){
        super.execute()
        let position = TableElement.getCellPosition(this.element,this.cell)
        let length = TableElement.getRowCellWidth(this.element.rows[position.y])
        let y = this.cell.rowspan? this.cell.rowspan : 1
        TableElement.addRows(this.element,undefined,length,undefined, undefined, position.y + y)
    }

}

/*Executing this command adds new row with content in cells to the 
given element left of the the given cell
*/
export class AddColumnLeft extends DefaultTableCommand{

    constructor(public element: TableElement, private cell: Cell){
        super(element)
    }

    execute(){
        super.execute()
        let position = TableElement.getCellPosition(this.element,this.cell)
        let length = TableElement.getRowCellWidth(this.element.rows[position.y])
        TableElement.addColumns(this.element,undefined,undefined, undefined,position.x)
    }

}

/*Executing this command adds new row with content in cells to the 
given element right of the the given cell
*/
export class AddColumnRight extends DefaultTableCommand{
    
    constructor(public element: TableElement, private cell: Cell){
        super(element)
    }

    execute(){
        super.execute()
        let position = TableElement.getCellPosition(this.element,this.cell)
        let length = TableElement.getRowCellWidth(this.element.rows[position.y])
        let x = this.cell.colspan? this.cell.colspan : 1
        TableElement.addColumns(this.element,undefined,undefined, undefined,position.x + x)
    }

}

/*Executing this command deletes the row that contains the given cell from
the given element
*/
export class DeleteRow extends DefaultTableCommand{
    constructor(public element: TableElement, private cell: Cell){
        super(element)
    }

    execute(){
        super.execute()
        let position = TableElement.getCellPosition(this.element,this.cell)
        let content = <TableContent> this.element.content
        this.element.rows.splice(position.y,1)[0]
        content.rows.splice(position.y,1)[0]
    }
}

/*Executing this command deletes the column that contains the given cell from
the given element
*/
export class DeleteColumn extends DefaultTableCommand{
    constructor(public element: TableElement, private cell: Cell){
        super(element)
    }


    execute(){
        super.execute()
        let position = TableElement.getCellPosition(this.element,this.cell)
        let content = <TableContent> this.element.content
        this.element.rows.forEach(row =>{
            row.cells.splice(position.x,1)
        })
        content.rows.forEach(row =>{
            row.cells.splice(position.x,1)
        })
    }   
}

export class mergeSCells extends DefaultTableCommand{
    
    execute(){
        super.execute()
        this.rowString = JSON.stringify(this.element.rows)
        let content = <TableContent> this.element.content
        this.contentString = JSON.stringify(content.rows)
        let element = this.element
        var firstCell = TableElement.getTopLeftCorner(element,element.selectedCells)
        firstCell.selected = false
        firstCell.colspan = element.selectionWidth
        firstCell.rowspan = element.selectionHeight
        element.selectedCells.splice(element.selectedCells.indexOf(firstCell),1)
        element.rows.forEach(row=>{
            for (let i = row.cells.length; i> -1; i--){
                element.selectedCells.forEach(cell =>{
                    if (cell == row.cells[i]){
                        row.cells.splice(i,1)
                    }
                })
            }
        })
        TableElement.clearSelectedCells(this.element)            
    }

    unExecute(){
        super.unExecute()
        TableElement.clearSelectedCells(this.element)            
    }
}

export class changeSCellsBold extends DefaultTableCommand{

    execute(){
        super.execute()
        let bold = true
        var element = this.element
        if(element.selectedCells.every(cell=>cell.bold)){
            bold = false
        }
        element.selectedCells.forEach((cell) => {
            cell.bold = bold
        })

    }

    unExecute(){
        super.unExecute()
        TableElement.clearSelectedCells(this.element)            
    }

}

export class changeSCellsItalic extends DefaultTableCommand{

    execute(){
        super.execute()
        let italic = true
        var element = this.element
        if(element.selectedCells.every(cell=>cell.italic)){
            italic = false
        }
        element.selectedCells.forEach((cell) => {
            cell.italic = italic
        })
    }

    unExecute(){
        super.unExecute()
        TableElement.clearSelectedCells(this.element)            
    }

}

export class changeSCellsParam extends DefaultTableCommand {
    constructor(public element: TableElement, private paramName: string, private paramValue){
        super(element)
    }

    execute(){
        super.execute()
        this.element.selectedCells.forEach((cell) => {
            cell[this.paramName] = this.paramValue
        })
    }

    unExecute(){
        super.unExecute()
        TableElement.clearSelectedCells(this.element)            
    }
}

export class ChangeSCellsFont extends DefaultTableCommand {

    constructor(public element: TableElement, private font: Font){
        super(element)
    }

    execute(){
        this.element.selectedCells.forEach((cell) => {
            cell.font = this.font
        })
    }

    unExecute(){
        super.unExecute()
        TableElement.clearSelectedCells(this.element)            
    }
}

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

    static deleteRow(element: TableElement, position: number){
        let content = <TableContent> element.content
        element.rows.splice(position,1)
        content.rows.splice(position,1)
    }

    static deleteColumn(element: TableElement, position: number){
        let content = <TableContent> element.content
        element.rows.forEach(row =>{
            row.cells.splice(position,1)
        })
        content.rows.forEach(row =>{
            row.cells.splice(position,1)
        })

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

    static getTopLeftCorner(element: TableElement, selectedCells: Array<Cell>){
        let minCell: Cell = selectedCells[0]
        selectedCells.forEach(cell => { 
            if (minCell.position.x >= cell.position.x) { 
                if (minCell.position.y > cell.position.y){
                    minCell = cell
                }
            } 
        })
        return minCell
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