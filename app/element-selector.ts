import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/Rx';
import {Observable} from 'rxjs/Observable';
import {Element} from './element'
import {NewTextElementComponent} from './new-text-element.component'
import {Font} from './font'
import {TextElement} from './text-element'
import {TemplateInstanceStore} from './template-instance.store'
import {TableElement, ClientState} from './table-element'
import {StepSelector, ArrayStepSplice, BasicStep, CompositeStep} from './step-selector'

@Injectable()
export class ElementSelector {
    
  
    public selectedElement: Element;
    
    constructor(
        private templateInstanceStore: TemplateInstanceStore, private stepSelector: StepSelector
    ){}
  
    public changeElement(element: Element){
        this.selectedElement = element;
    }
    
    public changeFont(font: Font) {
        if (this.selectedElement.type == 'text_element'){
            var textElement = <TextElement>this.selectedElement
            this.stepSelector.makeStep(new BasicStep(this.selectedElement, "font", textElement.font, font))
            textElement.font = font
        } else if (this.selectedElement.type == 'table_element'){
            var steps = new Array
            var tableElement = <TableElement>this.selectedElement
            tableElement.selectedCells.forEach((cell) => {
                steps.push(new BasicStep(cell,"font",cell.font,font))
                cell.font = font
            })
            this.stepSelector.makeStep(new CompositeStep(steps))
        }
    }
    
    public deleteElement(){
        this.stepSelector.makeStep(new ArrayStepSplice(this.selectedElement, this.templateInstanceStore.getPageForElement(this.selectedElement).elements))
        this.templateInstanceStore.deleteElementFromTemplate(this.selectedElement);
    }
    
    changeTextAlign(align: string){
        var element = <TextElement>this.selectedElement
        this.stepSelector.makeStep(new BasicStep(this.selectedElement, "text_align", element.text_align, align))
        element.text_align = align
    }
    
    changeTextAlignVertical(align: string){
        var element = <TextElement>this.selectedElement
        element.text_align_vertical = align
    }
    
    setElementClientState(state: ClientState){
        (<TableElement>this.selectedElement).clientState = state
    }
    
    distributeTableRows(){
        var element = <TableElement>this.selectedElement
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
        var element = <TableElement>this.selectedElement
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
        var element = <TableElement>this.selectedElement
        var steps = new Array
        element.selectedCells.forEach((cell) => {
            steps.push(new BasicStep(cell, "font_size", cell.font_size, size))
            cell.font_size = size
        })
        this.stepSelector.makeStep(new CompositeStep(steps))
    }
    
    changeSelectedCellsBold(bold: boolean){
        var element = <TableElement>this.selectedElement
        var steps = new Array
        element.selectedCells.forEach((cell) => {
            steps.push(new BasicStep(cell, "bold", cell.bold, bold))
            cell.bold = bold
        })
        this.stepSelector.makeStep(new CompositeStep(steps))
    }
    
    changeSelectedCellsItalic(italic: boolean){
        var element = <TableElement>this.selectedElement
        var steps = new Array
        element.selectedCells.forEach((cell) => {
            steps.push(new BasicStep(cell, "italic", cell.italic, italic))
            cell.italic = italic
        })
        this.stepSelector.makeStep(new CompositeStep(steps))
    }
    
    changeSelectedCellsTextAlign(align: string){
        var element = <TableElement>this.selectedElement
        var steps = new Array
        element.selectedCells.forEach((cell) => {
            steps.push(new BasicStep(cell, "text_align", cell.text_align, align))
            cell.text_align = align
        })
        this.stepSelector.makeStep(new CompositeStep(steps))
    }
    
    changeSelectedCellsTextAlignVert(align: string){
        var element = <TableElement>this.selectedElement
        var steps = new Array
        element.selectedCells.forEach((cell) => {
            steps.push(new BasicStep(cell, "vertical_align", cell.vertical_align, align))
            cell.vertical_align = align
        })
        this.stepSelector.makeStep(new CompositeStep(steps))
    }
    
    clearSelection(){
        var element = <TableElement>this.selectedElement
        TableElement.clearSelectedCells(element)
    }
}