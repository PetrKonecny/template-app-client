import {Injectable} from '@angular/core';
import {Element} from './element'
import {Font} from '../font/font'
import {TextElement} from './text-element'
import {TemplateInstanceStore} from '../template-instance/template-instance.store'
import {TableElement, ClientState, Cell} from './table-element'
import {StepSelector, ArrayStepSplice, BasicStep, CompositeStep} from '../step-selector'
import {BehaviorSubject, Observable} from 'rxjs/Rx'

@Injectable()
export class ElementSelector {
    
    private _element: BehaviorSubject<Element> = new BehaviorSubject(null);
    public element: Observable<Element> = this._element.asObservable();  
    
    constructor(
        private templateInstanceStore: TemplateInstanceStore, private stepSelector: StepSelector
    ){}
  
    public changeElement(element: Element){
        if(!element){return}
        this._element.next(element)
    }
    
    public changeFont(font: Font) {
        if (this._element.value.type == 'text_element'){
            var textElement = <TextElement>this._element.value
            this.stepSelector.makeStep(new BasicStep(this._element.value, "font", textElement.font, font))
            textElement.font = font
        } else if (this._element.value.type == 'table_element'){
            var steps = new Array
            var tableElement = <TableElement>this._element.value
            tableElement.selectedCells.forEach((cell) => {
                steps.push(new BasicStep(cell,"font",cell.font,font))
                cell.font = font
            })
            this.stepSelector.makeStep(new CompositeStep(steps))
        }
    }

    clearSelect(){
        this._element.next(null)
    }
    
    public deleteElement(){
        this.stepSelector.makeStep(new ArrayStepSplice(this._element.value, this.templateInstanceStore.getPageForElement(this._element.value).elements))
        this.templateInstanceStore.deleteElementFromTemplate(this._element.value);
        this._element.next(null)
    }
    
    changeTextAlign(align: string){
        var element = <TextElement>this._element.value
        this.stepSelector.makeStep(new BasicStep(this._element.value, "text_align", element.text_align, align))
        element.text_align = align
    }
    
    changeTextAlignVertical(align: string){
        var element = <TextElement>this._element.value
        element.text_align_vertical = align
    }
    
    setElementClientState(state: ClientState){
        (<TableElement>this._element.value).clientState = state
    }
    
    distributeTableRows(){
        var element = <TableElement>this._element.value
        var total = 0
        var steps = new Array
        element.rows.forEach((row) => total += row.height)
        var avg = Math.ceil(total / (element.rows.length - 1))
        element.rows.forEach((row) => {
            steps.push(new BasicStep(row, "height", row.height,avg))
            row.height = avg;
        })
        this.stepSelector.makeStep(new CompositeStep(steps))
    }

    distributeTableColumns(){
        var element = <TableElement>this._element.value
        var total = 0
        var steps = new Array
        element.rows[0].cells.forEach((cell) => total += cell.width)
        var avg = Math.ceil(total / (element.rows[0].cells.length - 1))
        element.rows.forEach((row)=> row.cells.forEach((cell) => {
            steps.push(new BasicStep(cell, "width", cell.width,avg))
            cell.width = avg
        }))
        this.stepSelector.makeStep(new CompositeStep(steps))
    }
    
    changeSelectedCellsFontSize(size: number){
        var element = <TableElement>this._element.value
        var steps = new Array
        element.selectedCells.forEach((cell) => {
            steps.push(new BasicStep(cell, "font_size", cell.font_size, size))
            cell.font_size = size
        })
        this.stepSelector.makeStep(new CompositeStep(steps))
    }
    
    changeSelectedCellsBold(bold: boolean){
        var element = <TableElement>this._element.value
        var steps = new Array
        element.selectedCells.forEach((cell) => {
            steps.push(new BasicStep(cell, "bold", cell.bold, bold))
            cell.bold = bold
        })
        this.stepSelector.makeStep(new CompositeStep(steps))
    }
    
    changeSelectedCellsItalic(italic: boolean){
        var element = <TableElement>this._element.value
        var steps = new Array
        element.selectedCells.forEach((cell) => {
            steps.push(new BasicStep(cell, "italic", cell.italic, italic))
            cell.italic = italic
        })
        this.stepSelector.makeStep(new CompositeStep(steps))
    }
    
    changeSelectedCellsTextAlign(align: string){
        var element = <TableElement>this._element.value
        var steps = new Array
        element.selectedCells.forEach((cell) => {
            steps.push(new BasicStep(cell, "text_align", cell.text_align, align))
            cell.text_align = align
        })
        this.stepSelector.makeStep(new CompositeStep(steps))
    }
    
    changeSelectedCellsTextAlignVert(align: string){
        var element = <TableElement>this._element.value
        var steps = new Array
        element.selectedCells.forEach((cell) => {
            steps.push(new BasicStep(cell, "vertical_align", cell.vertical_align, align))
            cell.vertical_align = align
        })
        this.stepSelector.makeStep(new CompositeStep(steps))
    }

    private getTopLeftCorner(selectedCells: Array<Cell>){
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
    
    changeTextColor(color: string){
        let element = <TextElement> this._element.value
        element.text_color = color
    }
    
    changeBackgroundColor(color: string){
        this._element.value.background_color = color
    }
        
    changeSelectedCellsBackgroundColor(color: string){
        var element = <TableElement> this._element.value
        if (element.selectedCells && element.selectedCells.length > 0){
            element.selectedCells.forEach((cell,index) => {if(index>-1){cell.background_color = color}})
        }
    }
    
    changeSelectedCellsTextColor(color: string){
        var element = <TableElement> this._element.value
        if (element.selectedCells && element.selectedCells.length > 0){
            element.selectedCells.forEach(cell => cell.text_color = color)
        }
    }
    
    changeSelectedCellsBorderStyle(style: string){
        var element = <TableElement> this._element.value
        if (element.selectedCells && element.selectedCells.length > 0){
            element.selectedCells.forEach(cell => cell.border_style = style)
        }
    }
    
    changeSelectedCellsBorderColor(color: string){
        var element = <TableElement> this._element.value
        if (element.selectedCells && element.selectedCells.length > 0){
            element.selectedCells.forEach(cell => cell.border_color = color)
        }
    }
    
    changeSelectedCellsBorderWidth(width: number){
        var element = <TableElement> this._element.value
        if (element.selectedCells && element.selectedCells.length > 0){
            element.selectedCells.forEach(cell => cell.border_width = width)
        }
    }
    
    mergeCells(){
        var element = <TableElement> this._element.value
        var firstCell = this.getTopLeftCorner(element.selectedCells)
        firstCell.selected = false
        firstCell.colspan = element.selectionWidth
        firstCell.rowspan = element.selectionHeight
        element.selectedCells.splice(element.selectedCells.indexOf(firstCell),1)
        console.log(element.selectedCells)
        element.rows.forEach(row=>{
            for (let i = row.cells.length; i> -1; i--){
                element.selectedCells.forEach(cell =>{
                    if (cell == row.cells[i]){
                        console.log(row.cells[i].position)
                        row.cells.splice(i,1)
                    }
                })
            }
        })       
        TableElement.clearSelectedCells(<TableElement>this._element.value)
    }
    
    clearSelection(){
        var element = <TableElement>this._element.value
        TableElement.clearSelectedCells(element)
    }
}