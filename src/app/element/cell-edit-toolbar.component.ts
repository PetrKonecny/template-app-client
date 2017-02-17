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
    selector: 'cell-edit-toolbar',
    template: `                
                <button style="background: none; border:none;" [colorPicker]="getCellBgColor()"  [cpOutputFormat]="hex" (colorPickerChange)="changeSelectedCellsBackgroundColor($event)"><button md-icon-button><md-icon [style.color]="getCellBgColor()">format_color_fill</md-icon></button></button>
                <font-selector></font-selector>
                    <button md-icon-button [mdMenuTriggerFor]="textMenu"  mdTooltip="Format text">A</button>
                    <button mdTooltip="Cell text color"  style="background: none; border:none;" [colorPicker]="getCellTextColor()"  [cpOutputFormat]="hex" (colorPickerChange)="changeSelectedCellsTextColor($event)"><button md-icon-button><md-icon [style.color]="getCellTextColor()">format_color_text</md-icon></button></button>                
                    <my-md-menu #textMenu="mdMenu">
                        <button md-icon-button (click)="changeSelectedCellsTextAlign('left')"><md-icon>format_align_left</md-icon></button>
                        <button md-icon-button (click)="changeSelectedCellsTextAlign('right')"><md-icon>format_align_right</md-icon></button>
                        <button md-icon-button (click)="changeSelectedCellsTextAlign('center')"><md-icon>format_align_center</md-icon></button>
                        <button md-icon-button (click)="changeSelectedCellsBold()"><md-icon>format_bold</md-icon></button>
                        <button md-icon-button (click)="changeSelectedCellsItalic()"><md-icon>format_italic</md-icon></button>
                        <button md-icon-button (click)="changeSelectedCellsTextAlignVert('top')"><md-icon>vertical_align_top</md-icon></button>
                        <button md-icon-button (click)="changeSelectedCellsTextAlignVert('bottom')"><md-icon>vertical_align_bottom</md-icon></button>
                        <button md-icon-button (click)="changeSelectedCellsTextAlignVert('middle')"><md-icon>vertical_align_middle</md-icon></button>
                    </my-md-menu>
                <button md-icon-button mdTooltip="Clear selection" (click)="clearSelection()"><md-icon>clear</md-icon></button>
                <button md-icon-button *ngIf="element.selectionWidth > 1 || element.selectionHeight > 1" (click)="mergeCells()" mdTooltip="Merge selected cells">M</button>
                <button md-icon-button mdTooltip="Border format" [mdMenuTriggerFor]="borderMenu">B</button>
                <my-md-menu #borderMenu="mdMenu">
                    <button md-icon-button (click)="changeSelectedCellsBorderStyle('none')"><md-icon>border_clear</md-icon></button>
                    <button md-button (click)="changeSelectedCellsBorderStyle('solid none')">Top and bottom</button>
                    <button md-button (click)="changeSelectedCellsBorderStyle('none solid')">Left and right</button>
                    <button md-button (click)="changeSelectedCellsBorderStyle('solid')">All sides</button>
                </my-md-menu>
                <button style="background: none; border:none;" [colorPicker]="getCellBColor()"  [cpOutputFormat]="hex" (colorPickerChange)="changeSelectedCellsBorderColor($event)"><button md-icon-button><md-icon [style.color]="getCellBColor()">border_outer</md-icon></button></button>
             `,
    providers: [FontSelector]
})

export class CellEditToolbar {
    
    element: TableElement
    

    constructor(private elementSelector: ElementSelector, private fontSelector: FontSelector, private textSelector: TextSelector){
        this.elementSelector.element.subscribe(element=> this.element = <TableElement>element)
        this.fontSelector.fontSize.subscribe(fontSize=> this.changeSelectedCellsFontSize(fontSize))
        this.fontSelector.font.subscribe(font=> this.changeFont(font))
    }

    private getCellBgColor(){
        let color = this.element.selectedCells[0].background_color
        if(color){
            return color
        }else{
            return Cell.defaultBackgroundColor
        }
    }

    private getCellTextColor(){
        let color = this.element.selectedCells[0].text_color
        if(color){
            return color
        }else{
            return Cell.defaultTextColor
        }
    }

    private getCellBColor(){
        let color = this.element.selectedCells[0].border_color
        if(color){
            return color
        }else{
            return Cell.defaultBorderColor
        }
    }
    
    
    changeFont(font: Font){
        this.elementSelector.changeFont(font)
    }

    changeFontSize(size: number){
        console.log(size)
        this.elementSelector.changeFontSize(size)
    }
    
    
    changeSelectedCellsFontSize(size: number){
        this.elementSelector.changeSelectedCellsFontSize(size)
    }
    
    changeSelectedCellsBold(){
        this.elementSelector.changeSelectedCellsBold()
    }
    changeSelectedCellsItalic(){
        this.elementSelector.changeSelectedCellsItalic()
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