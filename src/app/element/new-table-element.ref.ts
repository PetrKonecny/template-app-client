import { Injectable } from '@angular/core';
import { NewTableElementComponent } from './new-table-element.component'
import { Cell, CellPosition, Row, TableElement } from './table-element'

/*
 * Extension of New Table Element component that can be injected by any other component under it
 * This reference is responsible for properly selecting the cells
 * such as resizing, moving, deleting
 */
  
@Injectable()
export class NewTableElementReference {
   
    //component which contains element for cells are being selected
    component: NewTableElementComponent
    //start of the selection
    selectionStart: CellPosition
    
    /**
    Implements simple algorithm for selecting cells always as a rectangle even with merged cells
    - create new structure by copiying the old one
    - every new cell references old one
    - if cell has colwidth or rowheight > 1 replace it with that many cells on the propper position
    - select rectangle
    - check if any cell references same old cell as some cell outside selection
    - if yes expand rectangle so it contains all of these cells
    - else return selection 
    */





    continueSelection(cell: Cell,x: number, y: number){ 
        //clones the original structure   
        let rows = this.cloneRows(this.component.element)    

        //expands the big cells   
        this.component.element.rows.forEach(row => row.cells.forEach(cell => { if (cell.colspan) { this.expandCell(rows,cell)}}))

        //gives new cells indexes x and y
        this.indexRowCopy(rows)

        //maps the old selection start onto new one
        let selectionStart = this.translateToCopyPosition(this.selectionStart,rows)
        
        //maps selection end onto new one
        let currentSelection = this.translateToCopyPosition(cell.position,rows)

        
        TableElement.clearSelectedCells(this.component.element)

        //gets corners from the selection
        let corners = this.getCornersFromSelection([selectionStart,currentSelection])

        //selects simple rectangle        
        let selectedRect = this.selectRect(corners.topLeft, corners.bottomRight,rows)

        //expands it 
        let expandedSelect = this.getExpandedSelection(rows,selectedRect)

        //repeats until there is nothing to expand to 
        while (selectedRect.length != expandedSelect.length){
            corners = this.getCornersFromSelection(expandedSelect.map(cell => cell.position))
            selectedRect = this.selectRect(corners.topLeft, corners.bottomRight,rows)
            expandedSelect = this.getExpandedSelection(rows,selectedRect)
        }

        //selects the referenced cell
        selectedRect.forEach(cell => { 
            if (this.component.element.selectedCells.indexOf(cell.cell) < 0){
                TableElement.selectCell(this.component.element,cell.cell)
            }
        })

        //stores width and height of the selection
        this.component.element.selectionWidth = corners.bottomRight.x - corners.topLeft.x + 1
        this.component.element.selectionHeight = corners.bottomRight.y - corners.topLeft.y + 1
    }
    

    //clones rows of the element into new array
    private cloneRows(element: TableElement){
        let rows: Array<RowCopy> = new Array
        element.rows.forEach(row => { 
            let row2 = { row: row, cells: new Array}
            row2.cells = this.cloneCells(row.cells)
            rows.push(row2)
        })
        return rows       
    }
    
    //clones cells of the element into new array
    private cloneCells(array: Array<Cell>){
        let cells: Array<CellCopy> = new Array
        array.forEach(cell => cells.push({cell:cell,position:null}))
        return cells
    }
    
    //returns xcount number of cells
    private multiplyCell(cell: Cell, count: number){
        let result: Array<CellCopy> = new Array
        for(let i = 0; i<count; i++){
            result.push({cell: cell,position:null})
        }
        return result
    }
    
    /** expands original bigger cells, for example for cell with
        colwidth 3 rowheight 2 creates 6 new cells where the big cell is
        in the table
    */
    private expandCell(rows: Array<RowCopy>, cell: Cell){
        let cells = rows[cell.position.y].cells
        var translatedPosition = this.translateToCopyPosition(cell.position,rows)
        Array.prototype.splice.apply(cells, [translatedPosition.x, 1].concat(<any>this.multiplyCell(cell,cell.colspan)))
        for (let i = cell.position.y + 1; i < cell.rowspan + cell.position.y; i++ ){
            cells = rows[i].cells
            Array.prototype.splice.apply(cells, [translatedPosition.x, 0].concat(<any>this.multiplyCell(cell,cell.colspan)))
        }        
    }
    
    //gets expanded selection
    private getExpandedSelection(rows: Array<RowCopy>, selectedCells: Array<CellCopy>){
        let allCells: Array<CellCopy> = [].concat.apply([], rows.map(row => row.cells))
        let notSelectedCells = allCells.filter(cell => selectedCells.indexOf(cell) < 0)
        let overlapingCells: Array<Cell> = new Array
        let overlapingCellCopy: Array<CellCopy> = new Array
        selectedCells.forEach(cell => {if(overlapingCells.indexOf(cell.cell)<0){notSelectedCells.forEach(nsCell =>{
            if(cell.cell == nsCell.cell){
                if (overlapingCells.indexOf(cell.cell)<0){
                    overlapingCells.push(nsCell.cell)
                }
                overlapingCellCopy.push(nsCell)
            }
        })}})
        return selectedCells.concat(overlapingCellCopy)
    }
    
    //gets corners of selection
    private getCornersFromSelection(selectedPositions: Array<CellPosition>){
        let topLeftCorner = new CellPosition
        let bottomRightCorner = new CellPosition
        let maxX = 0
        let minX = selectedPositions[0].x
        let maxY = 0
        let minY = selectedPositions[0].y
        selectedPositions.forEach(cell => { 
            if (maxX < cell.x) { maxX = cell.x}
            if (minX > cell.x) { minX = cell.x}
            if (maxY < cell.y) { maxY = cell.y}
            if (minY > cell.y) { minY = cell.y}
        })
        return {topLeft:{x:minX,y:minY}, bottomRight:{x: maxX,y: maxY}}
    }
    
    //indexes element with x and y
    private indexTable(element: TableElement){
        element.rows.forEach((row, y) => row.cells.forEach((cell, x) => cell.position = {x:x,y:y}))
    }
    
    //indexes copy with x and y
    private indexRowCopy(copy: Array<RowCopy>){
        copy.forEach((row, y) => row.cells.forEach((cell, x) => cell.position = {x:x,y:y}))
    }
    
    //selects one cell as staring point
    startSelection(cell: Cell,x: number,y: number){
        if (this.component.element.selectedCells){
            TableElement.clearSelectedCells(this.component.element)
        }
        TableElement.selectCell(this.component.element, cell)
        this.indexTable(this.component.element)
        this.selectionStart = {x:cell.position.x, y:cell.position.y}     
    }
    
    //gets coordinates of original cell in the copy
    translateToCopyPosition(position: CellPosition, rows: Array<RowCopy>){
        for (let i = 0; i < rows.length; i++){
            for (let j = 0; j < rows[i].cells.length; j++){
                if (rows[i].cells[j].cell.position.x == position.x && rows[i].cells[j].cell.position.y == position.y){
                    return {x:j,y:i}
                }
            }
        }
        return position
    }
    
    //selects rectangle assuming every cell has same dimensions
    selectRect(topLeftCorner: CellPosition, bottomRightCorner: CellPosition, rows){
        let result = new Array
        for(let i = topLeftCorner.y; i<=bottomRightCorner.y; i++){
            for(let j = topLeftCorner.x; j<=bottomRightCorner.x; j++){
                let cell = rows[i].cells[j]
                result.push(cell)
            }
        }
        return result
    }
    
}

class CellCopy{
    cell: Cell
    position: CellPosition
}
class RowCopy{
    row: Row
    cells: Array<CellCopy>
}

