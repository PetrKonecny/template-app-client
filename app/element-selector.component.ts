import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ImageListComponent} from './image-list.component';
import { ImageService } from './image.service';
import { Image} from './image';
import { Element } from './element';
import { TextElement } from './text-element';
import { ElementSelector} from './element-selector';
import {UPLOAD_DIRECTIVES} from 'ng2-uploader/ng2-uploader';
import {FontSelector} from './font-selector';
import {FontSelectorComponent} from './font-selector.component';
import {FontService} from './font.service';
import {ClientState, TableElement, Cell} from './table-element'
import {ColorPickerDirective} from 'ct-angular2-color-picker/component'
import {TextSelectorComponent} from './text-selector.component'

@Component({
    selector: 'element-select',
    template: ` 
                <span *ngIf="elementSelector.selectedElement"> 
                <br><b *ngIf="elementSelector.selectedElement.id">Element ID: {{elementSelector.selectedElement.id}}</b><br>
                <button (click)="deleteElement()">Delete element</button><br>
                Width: <input [(ngModel)]="elementSelector.selectedElement.width"  (keyup)="0"><br>
                Height: <input [(ngModel)]="elementSelector.selectedElement.height"  (keyup)="0"><br>
                Position X: <input [(ngModel)]="elementSelector.selectedElement.positionX"   (keyup)="0"><br>
                Position Y: <input [(ngModel)]="elementSelector.selectedElement.positionY"   (keyup)="0">
                <br>Background color: <input [colorPicker]="elementSelector.selectedElement.background_color ? elementSelector.selectedElement.background_color : defaultBackgroundColor"  (colorPickerChange)="changeBackgroundColor($event)" [style.background]="elementSelector.selectedElement.background_color ? elementSelector.selectedElement.background_color : defaultBackgroundColor" />
                <div *ngIf="elementSelector.selectedElement.type == 'text_element'">
                    <span *ngIf="elementSelector.selectedElement.font"> Font: {{elementSelector.selectedElement.font.name}}</span>
                    <font-selector *ngIf="fontsOpened" ></font-selector>
                    <button *ngIf="!fontsOpened" (click)="openFonts()">Change font</button>
                    <br>Font size: <input [(ngModel)]="elementSelector.selectedElement.font_size" (keyup)="0">\n\
                    <br>Font color: <input [colorPicker]="elementSelector.selectedElement.text_color ? elementSelector.selectedElement.text_color : defaultTextColor" (colorPickerChange)="changeTextColor($event)" [style.background]="elementSelector.selectedElement.text_color ? elementSelector.selectedElement.text_color : defaultTextColor" />
                    <div>
                        <h2>Text align</h2><br>
                        <button (click)="changeTextAlign('left')">Allign left</button>
                        <button (click)="changeTextAlign('right')">Allign right</button>
                        <button (click)="changeTextAlign('center')">Allign center</button>
                        <button (click)="changeTextAlign('justify')">Justify</button>
                    </div>
                    Editor Controlls:<br>
                    <text-select *ngIf="elementSelector.selectedElement.content" [content]="elementSelector.selectedElement.content"></text-select>
                </div>
                <div *ngIf="elementSelector.selectedElement.type == 'table_element'"> 
                    <button *ngIf="elementSelector.selectedElement.clientState != 2" (click)="editTable()">Edit table</button>
                    <button *ngIf="elementSelector.selectedElement.clientState != 0" (click)="moveTable()">Move or resize table</button>
                    <button *ngIf="elementSelector.selectedElement.clientState != 1" (click)="filloutTable()">Fillout table</button>\n\
                    <button *ngIf="elementSelector.selectedElement.clientState != 3" (click)="editCells()">Edit cells</button>
                    <div *ngIf="elementSelector.selectedElement.clientState == 3 && elementSelector.selectedElement.selectedCells?.length > 0">
                        <br>Background color: <input [colorPicker]="elementSelector.selectedElement.selectedCells[0].background_color ? elementSelector.selectedElement.selectedCells[0].background_color : defaultCellBackgroundColor" [cpOutputFormat]="hex" (colorPickerChange)="changeSelectedCellsBackgroundColor($event)" [style.background]="elementSelector.selectedElement.selectedCells[0].background_color ? elementSelector.selectedElement.selectedCells[0].background_color : defaultCellBackgroundColor" />
                        <font-selector *ngIf="fontsOpened" ></font-selector>
                        <button *ngIf="!fontsOpened" (click)="openFonts()">Change font</button>
                        <br>Text color: <input [colorPicker]="elementSelector.selectedElement.selectedCells[0].text_color ? elementSelector.selectedElement.selectedCells[0].text_color : defaultCellTextColor" [cpOutputFormat]="hex" (colorPickerChange)="changeSelectedCellsTextColor($event)" [style.background]="elementSelector.selectedElement.selectedCells[0].text_color ? elementSelector.selectedElement.selectedCells[0].text_color : defaultCellTextColor" />
                        <br>Text size: <input #fontsize [value]="elementSelector.selectedElement.selectedCells[0].text_size" (keyup)="changeSelectedCellsFontSize(fontsize.value)">
                        <br>
                        Bold: <input type='checkbox' #bold (change)="changeSelectedCellsBold(bold.checked)">
                        Italic: <input type='checkbox' #italic (change)="changeSelectedCellsItalic(italic.checked)">
                        <br>
                        <button (click)="changeSelectedCellsTextAlign('left')">Allign left</button>
                        <button (click)="changeSelectedCellsTextAlign('right')">Allign right</button>
                        <button (click)="changeSelectedCellsTextAlign('center')">Allign center</button>
                        <br>
                        <button (click)="changeSelectedCellsTextAlignVert('top')">Align top</button>
                        <button (click)="changeSelectedCellsTextAlignVert('bottom')">Align bottom</button>
                        <button (click)="changeSelectedCellsTextAlignVert('middle')">Align middle</button>
                        <button (click)="clearSelection()">Clear selection</button>\n\
                        <button *ngIf="elementSelector.selectedElement.selectionWidth > 1" (click)="mergeCells()">Merge Cells</button>\n\
                        <br>
                        <button (click)="changeSelectedCellsBorderStyle('none')">No border</button>
                        <button (click)="changeSelectedCellsBorderStyle('solid none')">Top and bottom</button>
                        <button (click)="changeSelectedCellsBorderStyle('none solid')">Left and right</button>\n\
                        <button (click)="changeSelectedCellsBorderStyle('solid')">All sides</button>\n\
                        <br>Border color: <input [colorPicker]="elementSelector.selectedElement.selectedCells[0].border_color ? elementSelector.selectedElement.selectedCells[0].border_color : defaultCellBorderColor" [cpOutputFormat]="hex" (colorPickerChange)="changeSelectedCellsBorderColor($event)" [style.background]="elementSelector.selectedElement.selectedCells[0].border_color ? elementSelector.selectedElement.selectedCells[0].border_color : defaultCellBorderColor" />
                        <br>Border width: <input #borderWidth [value]="elementSelector.selectedElement.selectedCells[0].border_width" (keyup)="changeSelectedCellsBorderWidth(borderWidth.value)">
                    </div>
                    <div *ngIf="elementSelector.selectedElement.clientState == 2"  >
                        <button (click)="distributeRows()">Distribute rows</button>
                        <button (click)="distributeColumns()">Distribute columns</button>
                    </div>
                </div>
                </span>
             `,
    directives: [ImageListComponent, FontSelectorComponent, UPLOAD_DIRECTIVES, ColorPickerDirective, TextSelectorComponent],
    providers: [ImageService, FontSelector, FontService]
})

export class ElementSelectorComponent implements OnInit {
    
    fontsOpened : boolean;
    
    defaultBackgroundColor: string = Element.defaultBackgroundColor
    defaultTextColor: string = TextElement.defaultTextColor
    defaultCellBackgroundColor: string = Cell.defaultBackgroundColor
    defaultCellBorderColor: string = Cell.defaultBorderColor
    defaultCellTextColor: string = Cell.defaultTextColor
            
    constructor(private elementSelector: ElementSelector, private fontSelector: FontSelector){
    }
    
    ngOnInit(){
        this.fontSelector.selectorWindowOpened.subscribe(opened => this.fontsOpened = opened)
    }
    
    openFonts(){
        this.fontSelector.openSelectorWindow()
    }
    
    editTable(){
        this.elementSelector.setElementClientState(ClientState.editTable)
    }
    
    moveTable(){
        this.elementSelector.setElementClientState(ClientState.moveResize)
    }
    
    filloutTable(){
        this.elementSelector.setElementClientState(ClientState.fillOut)
    }
    
    editCells(){
        this.elementSelector.setElementClientState(ClientState.editCells)
    }
    
    distributeRows(){
        this.elementSelector.distributeTableRows()
    }
    
    distributeColumns(){
        this.elementSelector.distributeTableColumns()
    }
    
    changeSelectedCellsFontSize(size: number){
        this.elementSelector.changeSelectedCellsFontSize(size)
    }
    
    changeSelectedCellsBold(bold: boolean){
        this.elementSelector.changeSelectedCellsBold(bold)
    }
    changeSelectedCellsItalic(italic: boolean){
        this.elementSelector.changeSelectedCellsItalic(italic)
    }
    
    changeSelectedCellsTextAlign(align: string){
        this.elementSelector.changeSelectedCellsTextAlign(align)
    }
    
    changeSelectedCellsTextAlignVert(align: string){
        this.elementSelector.changeSelectedCellsTextAlignVert(align)
    }
    
    clearSelection(){
        this.elementSelector.clearSelection()
    }
  
    deleteElement(){
        this.elementSelector.deleteElement();
        this.elementSelector.selectedElement = null
    }
     
    changeTextAlign(align: string){
        this.elementSelector.changeTextAlign(align)
    }
    
    changeTextAlignVertical(align: string){
        this.elementSelector.changeTextAlignVertical(align)
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
        let element = <TextElement> this.elementSelector.selectedElement
        element.text_color = color
    }
    
    changeBackgroundColor(color: string){
        this.elementSelector.selectedElement.background_color = color
    }
        
    changeSelectedCellsBackgroundColor(color: string){
        var element = <TableElement> this.elementSelector.selectedElement
        if (element.selectedCells && element.selectedCells.length > 0){
            element.selectedCells.forEach((cell,index) => {if(index>-1){cell.background_color = color}})
        }
    }
    
    changeSelectedCellsTextColor(color: string){
        var element = <TableElement> this.elementSelector.selectedElement
        if (element.selectedCells && element.selectedCells.length > 0){
            element.selectedCells.forEach(cell => cell.text_color = color)
        }
    }
    
    changeSelectedCellsBorderStyle(style: string){
        var element = <TableElement> this.elementSelector.selectedElement
        if (element.selectedCells && element.selectedCells.length > 0){
            element.selectedCells.forEach(cell => cell.border_style = style)
        }
    }
    
    changeSelectedCellsBorderColor(color: string){
        var element = <TableElement> this.elementSelector.selectedElement
        if (element.selectedCells && element.selectedCells.length > 0){
            element.selectedCells.forEach(cell => cell.border_color = color)
        }
    }
    
    changeSelectedCellsBorderWidth(width: number){
        var element = <TableElement> this.elementSelector.selectedElement
        if (element.selectedCells && element.selectedCells.length > 0){
            element.selectedCells.forEach(cell => cell.border_width = width)
        }
    }
    
    mergeCells(){
        var element = <TableElement> this.elementSelector.selectedElement
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
        TableElement.clearSelectedCells(<TableElement>this.elementSelector.selectedElement)
    }
    
    onKey(){
        
    }
    
}