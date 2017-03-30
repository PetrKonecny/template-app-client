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
                <button md-icon-button mdTooltip="Barva pozadí vybraných buněk" [mdMenuTriggerFor]="backgroundColorMenu"><md-icon  [style.color]="getCellBgColor()">fiber_manual_record</md-icon></button>
                <my-md-menu #backgroundColorMenu>
                    <div md-menu-item [colorPicker]="getCellBgColor() ? getCellBgColor() : lastCellBgColor" style="width: 230px; height: 290px; padding: 0 !important;" [cpOutputFormat]="hex" (colorPickerChange)="changeSelectedCellsBackgroundColor($event)" [cpToggle]="true" [cpDialogDisplay]="'inline'" [cpAlphaChannel]="'disabled'">
                    </div>
                    <div md-menu-item style="overflow: hidden;">
                        Zobrazit/skrýt pozadí <md-checkbox #bgCheckbox [checked]="getCellBgColor()" (change)="toggleCellBackground(bgCheckbox.checked)" style="position: relative; z-index: 1000;"></md-checkbox>
                    </div>
                </my-md-menu>
                <font-selector (onFontSelected)="changeSelectedCellsFont($event)"  (onFontSizeSelected)="changeSelectedCellsFontSize($event)"></font-selector>
                <button md-icon-button mdTooltip="Barva textu" [mdMenuTriggerFor]="textColorMenu"><md-icon  [style.color]="getCellTextColor()">fiber_manual_record</md-icon></button>
                <my-md-menu #textColorMenu>
                    <div md-menu-item [colorPicker]="getCellTextColor()" style="width: 230px; height: 290px; padding: 0 !important;" [cpOutputFormat]="hex" (colorPickerChange)="changeSelectedCellsTextColor($event)" [cpToggle]="true" [cpDialogDisplay]="'inline'" [cpAlphaChannel]="'disabled'">
                    </div>                   
                </my-md-menu>
                <button md-icon-button [mdMenuTriggerFor]="textMenu"  mdTooltip="Format text">A</button>
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
                    <button md-menu-item (click)="changeSelectedCellsBorderStyle('none')">Žádný okraj</button>
                    <button md-menu-item (click)="changeSelectedCellsBorderStyle('solid none')">Nahoře a dole</button>
                    <button md-menu-item (click)="changeSelectedCellsBorderStyle('none solid')">Vlevo a vpravo</button>
                    <button md-menu-item (click)="changeSelectedCellsBorderStyle('solid')">Ze všech stran</button>
                </my-md-menu>
                <button md-icon-button mdTooltip="Barva rámečku" [mdMenuTriggerFor]="borderColorMenu"><md-icon  [style.color]="getCellBColor()">fiber_manual_record</md-icon></button>
                <my-md-menu #borderColorMenu>
                    <div md-menu-item [colorPicker]="getCellBColor()" style="width: 230px; height: 290px; padding: 0 !important;" [cpOutputFormat]="hex" (colorPickerChange)="changeSelectedCellsBorderColor($event)" [cpToggle]="true" [cpDialogDisplay]="'inline'" [cpAlphaChannel]="'disabled'">
                    </div>                   
                </my-md-menu>
             `,
})

export class CellEditToolbar {
    
    element: TableElement
    lastCellBgColor = Cell.defaultBackgroundColor
    lastCellTextColor = Cell.defaultTextColor
    lastCellBColor = Cell.defaultBorderColor
    

    constructor(private elementStore: ElementStore, private commands: TableElementCommands){
        this.elementStore.element.subscribe(element=> this.element = <TableElement>element)
    }

    getCellBgColor(){
        return this.element.selectedCells[0].background_color
        
    }

    getCellTextColor(){
        let color = this.element.selectedCells[0].text_color
        if(color){
            return color
        }else{
            return this.lastCellTextColor
        }
    }

    getCellBColor(){
        let color = this.element.selectedCells[0].border_color
        if(color){
            return color
        }else{
            return this.lastCellBColor
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
        if(this.getCellBgColor()){
            this.commands.changeSCellsBackgroundColor(this.element, null)
        }else{
            this.commands.changeSCellsBackgroundColor(this.element, this.lastCellBgColor)
        }
    }
        
    changeSelectedCellsBackgroundColor(color: string){
        this.lastCellBgColor = color
        if(this.getCellBgColor() &&  this.getCellBgColor() !== this.lastCellBgColor){
            this.commands.changeSCellsBackgroundColor(this.element, this.lastCellBgColor)
        }
    }
    
    changeSelectedCellsTextColor(color: string){
        this.lastCellTextColor = color
        this.commands.changeSCellsTextColor(this.element,color)
    }
    
    changeSelectedCellsBorderStyle(style: string){
        this.commands.changeSCellsBorderStyle(this.element,style)
    }
    
    changeSelectedCellsBorderColor(color: string){
        this.lastCellBColor = color
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