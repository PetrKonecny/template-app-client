import {Font} from '../font/font';
import {Element} from './element'
import {TableContent, RowContent, CellContent} from '../content/table-content'
export enum ClientState {moveResize,fillOut,editTable,editCells}
import {UndoRedoService, Command, BufferCommand} from '../undo-redo.service'
import {Injectable} from '@angular/core';

/* Extending this command should allow rollback funcionality for
most table commands, however it is not the most optimal solution
when performance is a concern (for example with larger tables) custon unExecute method 
should be implemented instead
*/
@Injectable()
export class TableElementCommands{

    constructor(private service: UndoRedoService){}

    /**adds rows above the ce;;
    @param element - element to add row to
    @param cell - cell that the row should be added above
    */
    addRowAbove(element: TableElement, cell: Cell){
        this.service.execute(new AddRowAbove(element,cell))
    }

    /**adds row below the cell
    @param element - element to add row to
    @param cell - cell that the row should be added below
    */
    addRowBelow(element: TableElement, cell: Cell){
        this.service.execute(new AddRowBelow(element,cell))
    }

    /**adds column left to the cell
    @param element - element to add column to
    @param cell - cell that the column should be added next to
    */
    addColumnLeft(element: TableElement, cell: Cell){
        this.service.execute(new AddColumnLeft(element,cell))
    }

    /**adds column right to the cell
    @param element - element to add column to
    @param cell - cell that the column should be added next to
    */
    addColumnRight(element: TableElement, cell: Cell){
        this.service.execute(new AddColumnRight(element,cell))
    }

    /**deletes row with the cell
    @param element - element to remove row from
    @param cell - cell which row should be deleted
    */
    deleteRow(element: TableElement, cell: Cell){
        this.service.execute(new DeleteRow(element,cell))
    }

    /**deletes column with the cell
    @param element - element to remove column from
    @param cell - cell which column should be deleted
    */
    deleteColumn(element: TableElement, cell: Cell){
        this.service.execute(new DeleteColumn(element,cell))
    }

    /**merges selected cells
    @param element - element which cells are being merged
    */
    mergeSCells(element: TableElement){
        this.service.execute(new mergeSCells(element))
    }

    /**merges selected cells
    @param element - element which cells are being merged
    */
    changeSCellsBold(element: TableElement){
        this.service.execute(new changeSCellsBold(element))
    }

    /**chengs selected cells font to italic
    @param element - element containing the cells
    */
    changeSCellsItalic(element: TableElement){
        this.service.execute(new changeSCellsItalic(element))
    }

    /**chengs selected cells border width
    @param element - element containing the cells
    @param width - width of the border 
    */
    changeSCellsBorderW(element: TableElement, width: number){
        this.service.execute(new changeSCellsParam(element,"border_width",width))
    }

    /**chengs selected cells border style
    @param element - element containing the cells
    @param style - css style to be set
    */
    changeSCellsBorderStyle(element: TableElement, style: string){
        this.service.execute(new changeSCellsParam(element,"border_style",style))
    }

    /**chengs selected cells border color
    @param element - element containing the cells
    @param color - color of the border
    */
    changeSCellsBorderColor(element: TableElement, color: string){
        this.service.execute(new changeSCellsParam(element,"border_color",color))
    }

    /**chengs selected cells background color
    @param element - element containing the cells
    @param color - color of the border
    */
    changeSCellsBackgroundColor(element: TableElement, color: string){
        this.service.execute(new changeSCellsParam(element,"background_color",color))
    }

    /**chengs selected cells background display
    @param element - element containing the cells
    @param value - whether background should be displayed or not
    */
    toggleSCellsBackground(element: TableElement, value: boolean){
        if(value){
            this.service.execute(new changeSCellsParam(element,"background_color",Element.defaultBackgroundColor))
        }else{
            this.service.execute(new changeSCellsParam(element,"background_color",null))
        }
    }

    /**chengs selected cells text align
    @param element - element containing the cells
    @param align - css value of the alignement
    */
    changeSCellsTextAlign(element: TableElement, align: string){
        this.service.execute(new changeSCellsParam(element,"text_align",align))
    }

    /**chengs selected cells fvertical align
    @param element - element containing the cells
    @param align - css value of the alignement
    */
    changeSCellsTextAlignVert(element: TableElement, align: string){
        this.service.execute(new changeSCellsParam(element,"vertical_align",align))
    }

    /**chengs selected cells font size
    @param element - element containing the cells
    @param size - size of the fonts
    */
    changeSCellsFontSize(element: TableElement, size: number){
        this.service.execute(new changeSCellsParam(element,"font_size",size))
    }

    /**chengs selected cells text color
    @param element - element containing the cells
    @param color - color of the text
    */
    changeSCellsTextColor(element: TableElement, color: string){
        this.service.execute(new changeSCellsParam(element,"text_color",color))
    }

    /**chengs selected cells font
    @param element - element containing the cells
    @param font - font that is going to be set
    */
    ChangeSCellsFont(element: TableElement, font: Font){
        this.service.execute(new ChangeSCellsFont(element,font))
    }

    /**chengs selected cells row height
    @param element - element containing the cells
    @param dimensions - dimensions to change height by
    @param y - coordinate of the row
    */
    changeRowHeight(element: TableElement, dimensions, y){
        this.service.addToBufferAndExecute(new setRowHeight(element,dimensions,y))
    }

    /**chengs selected cells column width
    @param element - element containing the cells
    @param dimensions - dimensions to change width by
    @param x - coordinate of the column
    */
    changeColumnWidth(element: TableElement, dimensions, x){
        this.service.addToBufferAndExecute(new setColumnWidth(element,dimensions,x))
    }
}

/* Default table command which can be extended to provide
undo and redo funcionality for other commands on the TableElement
*/
export class DefaultTableCommand implements Command{

    constructor(public element: TableElement){

    }
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

/**Executing this command merges selected cells together into one
*/
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

/**Executing this command changes selected cells to bold
**/
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

/**Executing this command changes selected cells font to italic
**/
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

/**Executing this command changes selected cells parameter 
*/
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

/**Executing this command sets row height
*/
export class setRowHeight extends DefaultTableCommand implements BufferCommand {
    constructor(public element: TableElement, private dimensions, private y: number){
        super(element)
    }

    execute(){
        super.execute()
        this.element.rows[this.y].height += this.dimensions.top
    }

    getStoredState(){
        return {content: this.contentString, rows: this.rowString}
    }

    setStoredState(params){
        this.rowString = params.rows
        this.contentString = params.content
    }
}

/**Executing this command sets column width
*/
export class setColumnWidth extends DefaultTableCommand implements BufferCommand {
    constructor(public element: TableElement, private dimensions, private x: number){
        super(element)
    }

    execute(){
        super.execute()
        for (var row of this.element.rows){
            row.cells[this.x].width += this.dimensions.left
        }
    }

    getStoredState(){
        return {content: this.contentString, rows: this.rowString}
    }

    setStoredState(params){
        this.rowString = params.rows
        this.contentString = params.content
    }
}


/**Executing this command changes selected cells font
*/
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

//Table element model 
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

    /** adds rows to the element
    @param element - element to add rows to
    @param count - number of rows to add
    @param length - length of the rows to add
    @param height - height of the rows to add
    @param width - width of the rows to add
    @param position - position in the table where to add the rows
    */
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

    /** adds columns to the element
    @param element - element to add columns to
    @param count - number of columns to add
    @param height - height of the rows to add
    @param width - width of the columns to add
    @param position - position in the table where to add the rows
    */
    static addColumns(element:TableElement, count: number = 1, height: number = this.default_row_height, width: number = this.default_cell_width, position: number = 0){
        if(!element.content){
            element.content = new TableContent
        }
        TableContent.addColumns(<TableContent>element.content, count, position)
        element.rows.forEach(row =>{
            Row.addCells(row,1,width,position)

        })
    }

    /**gets width of the row
    @param row - row which width to get
    */
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

    /**deletes the row 
    @param element - element to delete the row from
    @param position - position of the row to delete
    */
    static deleteRow(element: TableElement, position: number){
        let content = <TableContent> element.content
        element.rows.splice(position,1)
        content.rows.splice(position,1)
    }

    /**deletes the column 
    @param element - element to delete the column from
    @param position - position of the column to delete
    */
    static deleteColumn(element: TableElement, position: number){
        let content = <TableContent> element.content
        element.rows.forEach(row =>{
            row.cells.splice(position,1)
        })
        content.rows.forEach(row =>{
            row.cells.splice(position,1)
        })

    }

    /**gets position of the cell  
    @param element - element to containing the cell
    @param cell - cell which position to get
    */
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
    
    /**adds cells to the end of every row of the element
    @param element - element to add rows to 
    @param width - width of the cell
    */
    static addCellToRows(element:TableElement, width: number = this.default_cell_width){
        for(var row of element.rows){
            var cell = new Cell
            cell.width = width
            row.cells.push(cell)
        }
    }
    
    /**removes one cell from end of every row
    @param element - element to remove cells from
    */
    static removeCellFromRows(element: TableElement){
        for(var row of element.rows){
            row.cells.pop()
        }
    }
    
    /**selects the cell from the element
    @param element - element containing the cell
    @param cell - cell to be selected
    */
    static selectCell(element: TableElement, cell: Cell){
        cell.selected = true
        if (!element.selectedCells){
            element.selectedCells = new Array
        }
        element.selectedCells.push(cell)
    }
    
    /**clears all selected cells
    @param element - element to clear
    */
    static clearSelectedCells(element: TableElement){
        element.rows.forEach((row)=> row.cells.forEach((cell) => cell.selected = false))
        element.selectedCells = new Array
    }

    /**gets top left corner (min. x and y coord.) from the given cells
    @param element - element containing the cells
    @param selectedCells - array of cells we want to get corner from
    */
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

//model of the row of the table
export class Row{
    cells: Array<Cell>;
    height: number
    /**
    @param row - row to add cells to 
    @param conut - count of the cells to add
    @param width - width of the added cells
    @param position - position where to add the cells
    */
    static addCells (row: Row, count: number, width: number, position: number = 0){
        if (!row.cells) row.cells = new Array()
        for(var i = 0; i<count; i++){
            var cell = new Cell()
            cell.width = width
            row.cells.splice(position,0,cell)
        }
    }
}

//model of the cell
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