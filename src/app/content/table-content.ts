import {Content} from './content'

export class TableContent extends Content {
    type: string = 'table_content'
    rows: Array<RowContent>
    
    static addRows(content: TableContent,  length: number, count: number = 1,  position: number = 0){
        if(!content.rows) content.rows = new Array()
        for(var i = 0; i<count; i++){
            var row = new RowContent()
            RowContent.addCells(row,length)
            console.log(length)
            content.rows.splice(position, 0, row)
        }
        console.log(content.rows)
    }

    static addColumns(content: TableContent, count: number = 1, position: number = 0){
        if(!content.rows) content.rows = new Array()
        content.rows.forEach(row =>{
            RowContent.addCells(row,count,position)
        })

    }
    
    
    static fillEmptyCells(content: TableContent){
        
        /*for (var row of content.rows){
            for (var cell of row.cells){
                console.log(cell)
                if(!cell.text){
                    cell = new CellContent()
                }
            }
        }*/
        
        
               
        content.rows.forEach((row) => {row.cells = row.cells.map((cell) => {
            if (!cell.text){
                return new CellContent()
            }else{
                return cell
            }
        })})
    }
}

export class RowContent{
    cells: Array<CellContent>
    
    static addCells (content: RowContent, count: number, position: number = 0){
        if (!content.cells) content.cells = new Array()
        for(var i = 0; i<count; i++){
            content.cells.splice(position,0,new CellContent())
        }
    }
} 

export class CellContent{
    text: string
}