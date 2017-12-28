import {Font} from '../font/font';
import {Element} from './element'
import {TableContent, RowContent, CellContent} from '../content/table-content'
import {Injectable} from '@angular/core';
import {NormalizerAddAction, changeMoreParamsOnObjNotNull, addObj, addMoreObj} from '../normalizers'

export enum ClientState {moveResize,fillOut,editTable,editCells}

export class AddRowAbove2 extends NormalizerAddAction{

    constructor(element: TableElement, content: TableContent, cell: Cell){
        super();
        element = {...element};
        content = {...content};
        let position = TableElement.getCellPosition(element,cell);
        let length = TableElement.getRowCellWidth(element.rows[position.y]);
        let y = cell.rowspan? cell.rowspan : 1;
        TableElement.addRows(element,undefined,length,undefined, undefined, position.y);
        TableContent.addRows(content,length, 1, position.y);
        this.data = addMoreObj([element,'elements'],[content,'contents']);
    }
}

/*Executing this command adds new row with content in cells to the 
given element below the given cell
*/
export class AddRowBelow2 extends NormalizerAddAction{

    constructor(element: TableElement, content: TableContent, cell: Cell){
        super();
        element = {...element};
        content = {...content};
        let position = TableElement.getCellPosition(element,cell);
        let length = TableElement.getRowCellWidth(element.rows[position.y]);
        let y = cell.rowspan? cell.rowspan : 1;
        TableElement.addRows(element,undefined,length,undefined, undefined, position.y + y);
        TableContent.addRows(content,length, 1, position.y + y);
        this.data = addMoreObj([element,'elements'],[content,'contents']);
    }
}

/*Executing this command adds new row with content in cells to the 
given element left of the the given cell
*/
export class AddColumnLeft2 extends NormalizerAddAction{
    subtype = 'ADD_COLUMN_LEFT';
    constructor(element: TableElement, content: TableContent, cell: Cell){
        super();
        element = {...element};
        content = {...content};
        let position = TableElement.getCellPosition(element,cell);
        let length = TableElement.getRowCellWidth(element.rows[position.y]);
        TableElement.addColumns(element,undefined,undefined,undefined,position.x);
        TableContent.addColumns(content,1,position.x);
        this.data = addMoreObj([element,'elements'],[content,'contents']);
    }
}

export class AddColumnRight2 extends NormalizerAddAction{
    subtype = 'ADD_COLUMN_RIGHT';
    constructor(element: TableElement, content: TableContent, cell: Cell){
        super();
        element = {...element};
        content = {...content};
        let position = TableElement.getCellPosition(element,cell);
        let length = TableElement.getRowCellWidth(element.rows[position.y]);
        let x = cell.colspan? cell.colspan : 1;
        TableElement.addColumns(element,undefined,undefined,undefined,position.x + x);
        TableContent.addColumns(content,1,position.x + x);
        this.data = addMoreObj([element,'elements'],[content,'contents']);
    }
}

/*Executing this command deletes the row that contains the given cell from
the given element
*/
export class DeleteRow2 extends NormalizerAddAction {
    subtype = "DELETE_ROW";
    constructor(element: TableElement, content: TableContent, cell: Cell){
        super();
        element = {...element};
        content = {...content};
        let position = TableElement.getCellPosition(element,cell);
        element.rows.splice(position.y,1)[0];
        content.rows.splice(position.y,1)[0];
        this.data = addMoreObj([element,'elements'],[content,'contents']);
    }

}

/*Executing this command deletes the column that contains the given cell from
the given element
*/

export class DeleteColumn2 extends NormalizerAddAction {
    subtype = "DELETE_COLUMN";
    constructor(element: TableElement, content: TableContent, cell: Cell){
        super();
        element = {...element};
        content = {...content};
        let position = TableElement.getCellPosition(element,cell);
        element.rows.forEach(row =>{
            row.cells.splice(position.x,1);
        })
        content.rows.forEach(row =>{
            row.cells.splice(position.x,1);
        })
        this.data = addMoreObj([element,'elements'],[content,'contents'])
    }

}

/**Executing this command merges selected cells together into one
*/

export class MergeCells extends NormalizerAddAction{
    subtype = 'MERGE_CELLS';
    constructor(element: TableElement){
       super(); 
       var element = {...element};
       var firstCell = TableElement.getTopLeftCorner(element,element.selectedCells);
       firstCell.selected = false;
       firstCell.colspan = element.selectionWidth;
       firstCell.rowspan = element.selectionHeight;
       element.selectedCells.splice(element.selectedCells.indexOf(firstCell),1)
       element.rows.forEach(row=>{
            for (let i = row.cells.length; i> -1; i--){
                element.selectedCells.forEach(cell =>{
                    if (cell === row.cells[i]){
                        row.cells.splice(i,1)
                    }
                })
            }
        })
        TableElement.clearSelectedCells(element);
        this.data = addObj(element,'elements');
    }
}

/**Executing this command changes selected cells to bold
**/
export class ChangeSCellsBold2 extends NormalizerAddAction{
    constructor(element: TableElement){      
        super();
        element = {...element};
        var bold = !element.selectedCells.every(cell=>cell.bold);
        element.selectedCells.forEach((cell) => {
            cell.bold = bold
        });
        this.data = addObj(element,'elements');
    }
}

/**Executing this command changes selected cells font to italic
**/

export class ChangeSCellsItalic2 extends NormalizerAddAction{
    constructor(element: TableElement){      
        super();        
        element = {...element};
        var italic = !element.selectedCells.every(cell=>cell.italic);
        element.selectedCells.forEach((cell) => {
            cell.italic = italic;
        });
        this.data = addObj(element,'elements');
    }
}

/**Executing this command changes selected cells parameter 
*/
export class ChangeSCellsParam2 extends NormalizerAddAction{
    constructor(element: TableElement, paramName, paramValue){
        super();        
        element = {...element};
        element.selectedCells.forEach((cell) => {
            cell[paramName] = paramValue;
        });
        this.data = addObj(element,'elements');
    }
}
/**Executing this command sets row height
*/

export class SetRowHeight2 extends NormalizerAddAction{
    constructor(element: TableElement, dimensions, y){
        super();        
        element = {...element};
        element.rows[y].height += dimensions.top;
        this.data = addObj(element,'elements');
    }
}

/**Executing this command sets column width
*/

export class SetColumnWidth2 extends NormalizerAddAction{
    constructor(element: TableElement, dimensions, x){
        super();
        element = {...element};
        for (var row of element.rows){
            row.cells[x].width += dimensions.left;
        };

    }
}


/**Executing this command changes selected cells font
*/
export class ChangeSCellsFont2 extends NormalizerAddAction{
    constructor(element: TableElement, font: Font){
        super();
        element = {...element};
        element.selectedCells.forEach((cell) => {
            cell.font = font
        });
        this.data = addObj(element,'elements');
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