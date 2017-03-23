import { Component, OnInit, ChangeDetectorRef} from '@angular/core';
import { ImageService } from '../image/image.service';
import { Element } from './element';
import { TextElement } from './text-element';
import {FontService} from '../font/font.service';
import {ClientState, TableElement, Cell, TableElementCommands} from './table-element'
import {Font} from '../font/font'
import {TextContent} from '../content/text-content'
import { ElementStore } from '../element/element.store'

@Component({
    selector: 'cell-edit-toolbar',
    template: `                     
                <md-checkbox [checked]="getSelectedCellsBackground()" #cellBackgroundCheckbox (change)="toggleCellBackground(cellBackgroundCheckbox.checked)" mdTooltip="zobrazit/skrýt pozadí buňek"></md-checkbox>
                <button *ngIf="getSelectedCellsBackground()" style="background: none; border:none;" [colorPicker]="getCellBgColor()"  [cpOutputFormat]="hex" (colorPickerChange)="changeSelectedCellsBackgroundColor($event)"><button md-icon-button><md-icon [style.color]="getCellBgColor()">format_color_fill</md-icon></button></button>
                <font-selector (onFontSelected)="changeSelectedCellsFont($event)"  (onFontSizeSelected)="changeSelectedCellsFontSize($event)"></font-selector>
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
                <button md-icon-button mdTooltip="Border format" [mdMenuTriggerFor]="borderMenu">B</button>
                <my-md-menu #borderMenu="mdMenu">
                    <button md-icon-button (click)="changeSelectedCellsBorderStyle('none')"><md-icon>border_clear</md-icon></button>
                    <button md-button (click)="changeSelectedCellsBorderStyle('solid none')">Top and bottom</button>
                    <button md-button (click)="changeSelectedCellsBorderStyle('none solid')">Left and right</button>
                    <button md-button (click)="changeSelectedCellsBorderStyle('solid')">All sides</button>
                </my-md-menu>
                <button style="background: none; border:none;" [colorPicker]="getCellBColor()"  [cpOutputFormat]="hex" (colorPickerChange)="changeSelectedCellsBorderColor($event)"><button md-icon-button><md-icon [style.color]="getCellBColor()">border_outer</md-icon></button></button>
             `,
})

export class CellEditToolbar {
    
    element: TableElement
    

    constructor(private elementStore: ElementStore, private commands: TableElementCommands){
        this.elementStore.element.subscribe(element=> this.element = <TableElement>element)
    }

    getCellBgColor(){
        let color = this.element.selectedCells[0].background_color
        if(color){
            return color
        }else{
            return Cell.defaultBackgroundColor
        }
    }

    getCellTextColor(){
        let color = this.element.selectedCells[0].text_color
        if(color){
            return color
        }else{
            return Cell.defaultTextColor
        }
    }

    getCellBColor(){
        let color = this.element.selectedCells[0].border_color
        if(color){
            return color
        }else{
            return Cell.defaultBorderColor
        }
    }
    
    getSelectedCellsBackground(){
        if(this.element.selectedCells){
           return this.element.selectedCells.filter(cell => cell.background_color).length > 0 
       }else{
           return false
       }
    }

    changeSelectedCellsFont(font: Font){
        this.commands.ChangeSCellsFont(this.element,font)
    }
    
   changeSelectedCellsFontSize(size: number){
        this.commands.changeSCellsFontSize(this.element,size)
    }
    
    changeSelectedCellsBold(){
        this.commands.changeSCellsBold(this.element)
        
    }
    
    changeSelectedCellsItalic(){
        this.commands.changeSCellsItalic(this.element)
    }
    
    changeSelectedCellsTextAlign(align: string){
        this.commands.changeSCellsTextAlign(this.element,align)
    }
    
    changeSelectedCellsTextAlignVert(align: string){
        this.commands.changeSCellsTextAlignVert(this.element,align)
    }

    
    toggleCellBackground(value: boolean){
        this.commands.toggleSCellsBackground(this.element,value)
    }
        
    changeSelectedCellsBackgroundColor(color: string){
        this.commands.changeSCellsBackgroundColor(this.element,color)
    }
    
    changeSelectedCellsTextColor(color: string){
        this.commands.changeSCellsTextColor(this.element,color)
    }
    
    changeSelectedCellsBorderStyle(style: string){
        this.commands.changeSCellsBorderStyle(this.element,style)
    }
    
    changeSelectedCellsBorderColor(color: string){
        this.commands.changeSCellsBorderColor(this.element,color)
    }
    
    changeSelectedCellsBorderWidth(width: number){
        this.commands.changeSCellsBorderW(this.element,width)
    }
    
    mergeCells(){
        this.commands.mergeSCells(this.element)
    }
    
    onKey(){
        
    }
    
}