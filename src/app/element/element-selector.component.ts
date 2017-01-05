import { Component, OnInit, ChangeDetectorRef} from '@angular/core';
import { ImageService } from '../image/image.service';
import { Element } from './element';
import { TextElement } from './text-element';
import { ElementSelector} from './element-selector';
import {FontSelector} from '../font/font-selector';
import {FontService} from '../font/font.service';
import {ClientState, TableElement, Cell} from './table-element'
import {Font} from '../font/font'
import {TextContent} from '../content/text-content'
import {TextSelector} from '../editor/text-selector'

@Component({
    selector: 'element-select',
    template: ` 
                <span *ngIf="element"> 
                <br><b *ngIf="element.id">Element ID: {{element.id}}</b><br>
                <button (click)="deleteElement()">Delete element</button><br>
                Width: <input [(ngModel)]="element.width"  (keyup)="0"><br>
                Height: <input [(ngModel)]="element.height"  (keyup)="0"><br>
                Position X: <input [(ngModel)]="element.positionX"   (keyup)="0"><br>
                Position Y: <input [(ngModel)]="element.positionY"   (keyup)="0">
                <br>Background color: <input [colorPicker]="element.background_color ? element.background_color : defaultBackgroundColor"  (colorPickerChange)="changeBackgroundColor($event)" [style.background]="element.background_color ? element.background_color : defaultBackgroundColor" />
                <div *ngIf="element.type == 'text_element'">
                    <span *ngIf="element.font"> Font: {{element.font.name}}</span>
                    <font-selector *ngIf="fontsOpened" ></font-selector>
                    <button *ngIf="!fontsOpened" (click)="onChangeFontButtonClick()">Change font</button>
                    <br>Font size: <input [(ngModel)]="element.font_size" (keyup)="0">
                    <br>Font color: <input [colorPicker]="element.text_color ? element.text_color : defaultTextColor" (colorPickerChange)="changeTextColor($event)" [style.background]="element.text_color ? element.text_color : defaultTextColor" />
                    <div>
                        <h2>Text align</h2><br>
                        <button (click)="changeTextAlign('left')">Allign left</button>
                        <button (click)="changeTextAlign('right')">Allign right</button>
                        <button (click)="changeTextAlign('center')">Allign center</button>
                        <button (click)="changeTextAlign('justify')">Justify</button>
                    </div>
                    Editor Controlls:<br>
                    <text-select *ngIf="element.content.editor"></text-select>
                </div>
                <div *ngIf="element.type == 'table_element'"> 
                    <button *ngIf="element.clientState != 2" (click)="editTable()">Edit table</button>
                    <button *ngIf="element.clientState != 0" (click)="moveTable()">Move or resize table</button>
                    <button *ngIf="element.clientState != 1" (click)="filloutTable()">Fillout table</button>
                    <button *ngIf="element.clientState != 3" (click)="editCells()">Edit cells</button>
                    <div *ngIf="element.clientState == 3 && element.selectedCells?.length > 0">
                        <br>Background color: <input [colorPicker]="element.selectedCells[0].background_color ? element.selectedCells[0].background_color : defaultCellBackgroundColor" [cpOutputFormat]="hex" (colorPickerChange)="changeSelectedCellsBackgroundColor($event)" [style.background]="element.selectedCells[0].background_color ? element.selectedCells[0].background_color : defaultCellBackgroundColor" />
                        <font-selector *ngIf="fontsOpened" (onFontSelected)="changeFont($event)"></font-selector>
                        <button *ngIf="!fontsOpened" (click)="onChangeFontButtonClick()">Change font</button>
                        <br>Text color: <input [colorPicker]="element.selectedCells[0].text_color ? element.selectedCells[0].text_color : defaultCellTextColor" [cpOutputFormat]="hex" (colorPickerChange)="changeSelectedCellsTextColor($event)" [style.background]="element.selectedCells[0].text_color ? element.selectedCells[0].text_color : defaultCellTextColor" />
                        <br>Text size: <input #fontsize [value]="element.selectedCells[0].text_size" (keyup)="changeSelectedCellsFontSize(fontsize.value)">
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
                        <button (click)="clearSelection()">Clear selection</button>
                        <button *ngIf="element.selectionWidth > 1" (click)="mergeCells()">Merge Cells</button>
                        <br>
                        <button (click)="changeSelectedCellsBorderStyle('none')">No border</button>
                        <button (click)="changeSelectedCellsBorderStyle('solid none')">Top and bottom</button>
                        <button (click)="changeSelectedCellsBorderStyle('none solid')">Left and right</button>
                        <button (click)="changeSelectedCellsBorderStyle('solid')">All sides</button>
                        <br>Border color: <input [colorPicker]="element.selectedCells[0].border_color ? element.selectedCells[0].border_color : defaultCellBorderColor" [cpOutputFormat]="hex" (colorPickerChange)="changeSelectedCellsBorderColor($event)" [style.background]="element.selectedCells[0].border_color ? element.selectedCells[0].border_color : defaultCellBorderColor" />
                        <br>Border width: <input #borderWidth [value]="element.selectedCells[0].border_width" (keyup)="changeSelectedCellsBorderWidth(borderWidth.value)">
                    </div>
                    <div *ngIf="element.clientState == 2"  >
                        <button (click)="distributeRows()">Distribute rows</button>
                        <button (click)="distributeColumns()">Distribute columns</button>
                    </div>
                </div>
                </span>
             `,
    providers: [ImageService, FontSelector, FontService, TextSelector]
})

export class ElementSelectorComponent implements OnInit {
    
    fontsOpened : boolean;
    element: Element
    
    defaultBackgroundColor: string = Element.defaultBackgroundColor
    defaultTextColor: string = TextElement.defaultTextColor
    defaultCellBackgroundColor: string = Cell.defaultBackgroundColor
    defaultCellBorderColor: string = Cell.defaultBorderColor
    defaultCellTextColor: string = Cell.defaultTextColor
            
    constructor(private elementSelector: ElementSelector, private fontSelector: FontSelector, private textSelector: TextSelector){
        this.elementSelector.element.subscribe(element=> {
            this.element = element
            if(this.element && this.element.content && this.element.content.type == 'text_content' && (<TextContent>this.element.content).editor){
                this.textSelector.changeEditor((<TextContent>this.element.content).editor)
            }
        })
    }
    
    ngOnInit(){
        this.fontSelector.selectorWindowOpened.subscribe(opened => this.fontsOpened = opened)
    }

    onChangeFontButtonClick(){
        this.fontSelector.openSelectorWindow()
        let sub = this.fontSelector.selectorWindowOpened.take(1).subscribe() 
        this.fontSelector.font.takeWhile(font => !sub.closed).subscribe((font) => this.elementSelector.changeFont(font))
    }
    
    openFonts(){
        this.fontSelector.openSelectorWindow()
    }
    
    changeFont(font: Font){
        this.elementSelector.changeFont(font)
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
    }
     
    changeTextAlign(align: string){
        this.elementSelector.changeTextAlign(align)
    }
    
    changeTextAlignVertical(align: string){
        this.elementSelector.changeTextAlignVertical(align)
    }
    
    
    changeTextColor(color: string){
        this.elementSelector.changeTextColor(color)
    }
    
    changeBackgroundColor(color: string){
        this.elementSelector.changeBackgroundColor(color)
    }
        
    changeSelectedCellsBackgroundColor(color: string){
        this.elementSelector.changeSelectedCellsBackgroundColor(color)
    }
    
    changeSelectedCellsTextColor(color: string){
        this.elementSelector.changeSelectedCellsTextColor(color)
    }
    
    changeSelectedCellsBorderStyle(style: string){
        this.elementSelector.changeSelectedCellsBorderStyle(style)
    }
    
    changeSelectedCellsBorderColor(color: string){
        this.elementSelector.changeSelectedCellsBorderColor(color)
    }
    
    changeSelectedCellsBorderWidth(width: number){
        this.elementSelector.changeSelectedCellsBorderWidth(width)
    }
    
    mergeCells(){
        this.elementSelector.mergeCells()
    }
    
    onKey(){
        
    }
    
}