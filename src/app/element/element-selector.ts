import {Injectable} from '@angular/core';
import {Element} from './element'
import {Font} from '../font/font'
import {TextElement} from './text-element'
import {TemplateInstanceStore} from '../template-instance/template-instance.store'
import {TableElement, ClientState, Cell, TableElementCommands} from './table-element'
import {BehaviorSubject, Observable} from 'rxjs/Rx'

@Injectable()
export class ElementSelector {
    
    private _element: BehaviorSubject<Element> = new BehaviorSubject(null);
    public element: Observable<Element> = this._element.asObservable();  
    
    constructor(
        private templateInstanceStore: TemplateInstanceStore, private commands: TableElementCommands
    ){}
  
    public changeElement(element: Element){
        if(!element){return}
        this._element.next(element)
    }
    
    public changeFont(font: Font) {
        if (this._element.value.type == 'text_element'){
            var textElement = <TextElement>this._element.value
            textElement.font = font
        } else if (this._element.value.type == 'table_element'){
            var tableElement = <TableElement>this._element.value
            tableElement.selectedCells.forEach((cell) => {
                cell.font = font
            })
        }
    }

    changeFontSize(size: number){
        let element = <TextElement>this._element.value
        element.font_size = size
    }

    clearSelect(){
        this._element.next(null)
    }
    
    public deleteElement(){
        this.templateInstanceStore.deleteElementFromTemplate(this._element.value);
        this._element.next(null)
    }
    
    changeTextAlign(align: string){
        var element = <TextElement>this._element.value
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
        element.rows.forEach((row) => total += row.height)
        var avg = Math.ceil(total / (element.rows.length - 1))
        element.rows.forEach((row) => {
            row.height = avg;
        })
    }

    distributeTableColumns(){
        var element = <TableElement>this._element.value
        var total = 0
        element.rows[0].cells.forEach((cell) => total += cell.width)
        var avg = Math.ceil(total / (element.rows[0].cells.length - 1))
        element.rows.forEach((row)=> row.cells.forEach((cell) => {
            cell.width = avg
        }))
    }
    

    changeTextColor(color: string){
        let element = <TextElement> this._element.value
        element.text_color = color
    }
    
    changeBackgroundColor(color: string){
        this._element.value.background_color = color
    }

    toggleElementBackground(value: boolean){
        if(value){
           this.changeBackgroundColor(Element.defaultBackgroundColor)
        }else{
           this.changeBackgroundColor(null)
        }

    }


    changeSelectedCellsFontSize(size: number){
        var element = <TableElement>this._element.value
        this.commands.changeSCellsFontSize(element,size)
    }
    
    changeSelectedCellsBold(){
        var element = <TableElement>this._element.value
        this.commands.changeSCellsBold(element)
        
    }
    
    changeSelectedCellsItalic(){
        var element = <TableElement>this._element.value
        this.commands.changeSCellsItalic(element)
    }
    
    changeSelectedCellsTextAlign(align: string){
        var element = <TableElement>this._element.value
        this.commands.changeSCellsTextAlign(element,align)
    }
    
    changeSelectedCellsTextAlignVert(align: string){
        var element = <TableElement>this._element.value
        this.commands.changeSCellsTextAlignVert(element,align)
    }

    
    toggleCellBackground(value: boolean){
        var element = <TableElement> this._element.value
        this.commands.toggleSCellsBackground(element,value)
    }
        
    changeSelectedCellsBackgroundColor(color: string){
        var element = <TableElement> this._element.value
        this.commands.changeSCellsBackgroundColor(element,color)
    }
    
    changeSelectedCellsTextColor(color: string){
        var element = <TableElement> this._element.value
        this.commands.changeSCellsTextColor(element,color)
    }
    
    changeSelectedCellsBorderStyle(style: string){
        var element = <TableElement> this._element.value
        this.commands.changeSCellsBorderStyle(element,style)
    }
    
    changeSelectedCellsBorderColor(color: string){
        var element = <TableElement> this._element.value
        this.commands.changeSCellsBorderColor(element,color)
    }
    
    changeSelectedCellsBorderWidth(width: number){
        var element = <TableElement> this._element.value
        this.commands.changeSCellsBorderW(element,width)
    }
    
    mergeCells(){
        var element = <TableElement> this._element.value
        this.commands.mergeSCells(element)
    }
    
    clearSelection(){
        var element = <TableElement>this._element.value
        TableElement.clearSelectedCells(element)
    }
}