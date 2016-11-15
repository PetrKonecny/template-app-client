import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/Rx';
import {Observable} from 'rxjs/Observable';
import {Element} from './element'
import {NewTextElementComponent} from './new-text-element.component'
import {Font} from './font'
import {TextElement} from './text-element'
import {TemplateInstanceStore} from './template-instance.store'
import {TableElement} from './table-element'

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
        (<TextElement>this.selectedElement).font = font;
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
    
    unlockTable(){
        (<TableElement>this.selectedElement).locked = false
    }
    
    lockTable(){
        (<TableElement>this.selectedElement).locked = true
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
        element.cells.forEach((cell) => total += cell.width)
        var avg = Math.ceil(total / (element.cells.length - 1))
        element.cells.forEach((cell) => cell.width = avg)
    }
}