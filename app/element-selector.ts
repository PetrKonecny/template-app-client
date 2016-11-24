import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/Rx';
import {Observable} from 'rxjs/Observable';
import {Element} from './element'
import {NewTextElementComponent} from './new-text-element.component'
import {Font} from './font'
import {TextElement} from './text-element'
import {TemplateInstanceStore} from './template-instance.store'
import {TableElement, ClientState} from './table-element'

@Injectable()
export class ElementSelector {
    
  
    public selectedElement: Element;
    
    constructor(
        private templateInstanceStore: TemplateInstanceStore
    ){}
  
    public changeElement(element: Element){
        this.selectedElement = element;
    }
    
    public changeFont(font: Font) {
        if (this.selectedElement.type == 'text_element'){
            (<TextElement>this.selectedElement).font = font
        } else if (this.selectedElement.type == 'table_element'){
            (<TableElement>this.selectedElement).selectedCells.forEach((cell) => cell.font = font)
        }
    }
    
    public deleteElement(){
        this.templateInstanceStore.deleteElementFromTemplate(this.selectedElement);
    }
    
    changeTextAlign(align: string){
        (<TextElement>this.selectedElement).text_align = align;
    }
    
    changeTextAlignVertical(align: string){
        (<TextElement>this.selectedElement).text_align_vertical = align;
    }
    
    setElementClientState(state: ClientState){
        (<TableElement>this.selectedElement).clientState = state
    }
    
    distributeTableRows(){
        var element = <TableElement>this.selectedElement
        var total = 0
        element.rows.forEach((row) => total += row.height)
        var avg = Math.ceil(total / (element.rows.length - 1))
        element.rows.forEach((row) => row.height = avg)
    }

    distributeTableColumns(){
        var element = <TableElement>this.selectedElement
        var total = 0
        element.rows[0].cells.forEach((cell) => total += cell.width)
        var avg = Math.ceil(total / (element.rows[0].cells.length - 1))
        element.rows.forEach((row)=> row.cells.forEach((cell) => cell.width = avg))
    }
    
    changeSelectedCellsFontSize(size: number){
        var element = <TableElement>this.selectedElement
        element.selectedCells.forEach((cell) => cell.font_size = size)
    }
    
    changeSelectedCellsBold(bold: boolean){
        var element = <TableElement>this.selectedElement
        element.selectedCells.forEach((cell) => cell.bold = bold)
    }
    
    changeSelectedCellsItalic(italic: boolean){
        var element = <TableElement>this.selectedElement
        element.selectedCells.forEach((cell) => cell.italic = italic)
    }
    
    changeSelectedCellsTextAlign(align: string){
        var element = <TableElement>this.selectedElement
        element.selectedCells.forEach((cell) => cell.text_align = align)
    }
    
    changeSelectedCellsTextAlignVert(align: string){
        var element = <TableElement>this.selectedElement
        element.selectedCells.forEach((cell) => cell.vertical_align = align)
    }
    
    clearSelection(){
        var element = <TableElement>this.selectedElement
        TableElement.clearSelectedCells(element)
    }
}