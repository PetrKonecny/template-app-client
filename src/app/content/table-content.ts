import {Content} from './content'

//table content model
export class TableContent extends Content {
    type: string = 'table_content'
    rows: Array<RowContent>
    
    /** adds rows into content
    @param cotnent - content to addd rows to
    @param length - length of row to add
    @param count - count of rows to add
    @param position - position where to add the rows
    */
    static addRows(content: TableContent,  length: number, count: number = 1,  position: number = 0){
        if(!content.rows) content.rows = new Array()
        for(var i = 0; i<count; i++){
            var row = new RowContent()
            RowContent.addCells(row,length)
            content.rows.splice(position, 0, row)
        }
    }

    /** adds columns into content
    @param content - content to add columns to
    @param count - number of columns to add
    @param position - position where to add the colmn
    */
    static addColumns(content: TableContent, count: number = 1, position: number = 0){
        if(!content.rows) content.rows = new Array()
        content.rows.forEach(row =>{
            RowContent.addCells(row,count,position)
        })

    }
    
    
    /** adds cell content into every cell in the content table
    @param content - content to fill
    */
    static fillEmptyCells(content: TableContent){
        
        content.rows.forEach((row) => {row.cells = row.cells.map((cell) => {
            if (!cell.text){
                return new CellContent()
            }else{
                return cell
            }
        })})
    }
}

//model for row in content
export class RowContent{
    cells: Array<CellContent>
    
    /**adds cells into the row
    @param content - rows to add
    @param count - number of rows to add
    @param position - position where to add the cells
    */
    static addCells (content: RowContent, count: number, position: number = 0){
        if (!content.cells) content.cells = new Array()
        for(var i = 0; i<count; i++){
            content.cells.splice(position,0,new CellContent())
        }
    }
} 

//model of content of cell
export class CellContent{
    text: string
}