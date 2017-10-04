import { Component } from '@angular/core';
import {TableElement, TableElementCommands, Cell} from './table-element'
import {Font} from '../font/font'
import { ElementStore } from '../element/element.store'

@Component({
    selector: 'cell-edit-toolbar',
    template: `  
                <!-- Controlls for changing background of selected cells -->

                <button md-icon-button mdTooltip="Barva pozadí vybraných buněk" [mdMenuTriggerFor]="backgroundColorMenu"><md-icon  [style.color]="getCellBgColor()">fiber_manual_record</md-icon></button>
                <md-menu #backgroundColorMenu>
                <div (click)="$event.stopPropagation()">
                    <div md-menu-item [colorPicker]="getCellBgColor() ? getCellBgColor() : lastCellBgColor" style="width: 230px; height: 290px; padding: 0 !important;" [cpOutputFormat]="hex" (colorPickerChange)="changeSelectedCellsBackgroundColor($event)" [cpToggle]="true" [cpDialogDisplay]="'inline'" [cpAlphaChannel]="'disabled'">
                    </div>
                    <div md-menu-item style="overflow: hidden;">
                        Zobrazit/skrýt pozadí <md-checkbox #bgCheckbox [checked]="getCellBgColor()" (change)="toggleCellBackground(bgCheckbox.checked)" style="position: relative; z-index: 1000;"></md-checkbox>
                    </div>
                </div>
                </md-menu>

                <!-- Controlls for changing font of selected cells-->

                <font-toolbar (onFontSelected)="changeSelectedCellsFont($event)"  (onFontSizeSelected)="changeSelectedCellsFontSize($event)"></font-toolbar>
                <button md-icon-button mdTooltip="Barva textu" [mdMenuTriggerFor]="textColorMenu"><md-icon  [style.color]="getCellTextColor()">fiber_manual_record</md-icon></button>
                <md-menu #textColorMenu>
                <div (click)="$event.stopPropagation()">
                    <div md-menu-item [colorPicker]="getCellTextColor()" style="width: 230px; height: 290px; padding: 0 !important;" [cpOutputFormat]="hex" (colorPickerChange)="changeSelectedCellsTextColor($event)" [cpToggle]="true" [cpDialogDisplay]="'inline'" [cpAlphaChannel]="'disabled'">
                    </div>    
                </div>               
                </md-menu>

                <!-- Controlls for changing text formating of selected cells-->

                <button md-icon-button [mdMenuTriggerFor]="textMenu"  mdTooltip="formát textu vybraných buněk">A</button>
                <md-menu (click)="$event.stopPropagation()" #textMenu="mdMenu">
                    <div style="width: 100%; height: 100%; overflow: hidden;">
                    <button md-icon-button (click)="changeSelectedCellsTextAlign('left')"><md-icon>format_align_left</md-icon></button>
                    <button md-icon-button (click)="changeSelectedCellsTextAlign('right')"><md-icon>format_align_right</md-icon></button>
                    <button md-icon-button (click)="changeSelectedCellsTextAlign('center')"><md-icon>format_align_center</md-icon></button>
                    <button md-icon-button (click)="changeSelectedCellsBold()"><md-icon>format_bold</md-icon></button>
                    <button md-icon-button (click)="changeSelectedCellsItalic()"><md-icon>format_italic</md-icon></button>
                    <button md-icon-button (click)="changeSelectedCellsTextAlignVert('top')"><md-icon>vertical_align_top</md-icon></button>
                    <button md-icon-button (click)="changeSelectedCellsTextAlignVert('bottom')"><md-icon>vertical_align_bottom</md-icon></button>
                    <button md-icon-button (click)="changeSelectedCellsTextAlignVert('middle')"><md-icon>vertical_align_middle</md-icon></button>
                    </div>
                </md-menu>

                <!-- Controlls for changing appearence of border of selected cells-->

                <button md-icon-button mdTooltip="formát rámečku vybraných buněk" [mdMenuTriggerFor]="borderMenu">B</button>
                <md-menu (click)="$event.stopPropagation()" #borderMenu="mdMenu">
                    <button md-menu-item (click)="changeSelectedCellsBorderStyle('none')">Žádný okraj</button>
                    <button md-menu-item (click)="changeSelectedCellsBorderStyle('solid none')">Nahoře a dole</button>
                    <button md-menu-item (click)="changeSelectedCellsBorderStyle('none solid')">Vlevo a vpravo</button>
                    <button md-menu-item (click)="changeSelectedCellsBorderStyle('solid')">Ze všech stran</button>
                </md-menu>

                <!-- Controlls for changing color of selected cells-->

                <button md-icon-button mdTooltip="Barva rámečku" [mdMenuTriggerFor]="borderColorMenu"><md-icon  [style.color]="getCellBColor()">fiber_manual_record</md-icon></button>
                <md-menu #borderColorMenu>
                <div (click)="$event.stopPropagation()">
                    <div md-menu-item [colorPicker]="getCellBColor()" style="width: 230px; height: 290px; padding: 0 !important;" [cpOutputFormat]="hex" (colorPickerChange)="changeSelectedCellsBorderColor($event)" [cpToggle]="true" [cpDialogDisplay]="'inline'" [cpAlphaChannel]="'disabled'">
                    </div>                   
                </div>
                </md-menu>
             `,
})


/* Provides controlls for table element for editing selected cells, shoudl be displayed only if the element
is in the appropriate editing state
*/
export class CellEditToolbar {
    
    //element that the toolbar controlls
    element: TableElement
    //last colors that were set in controll elements defaults to default colors
    lastCellBgColor = Cell.defaultBackgroundColor
    lastCellTextColor = Cell.defaultTextColor
    lastCellBColor = Cell.defaultBorderColor
    
    /*
    @param 'elementStore' - injects store that is provided by editor root and contains selected element
    @param 'commands' - injects commands used to change element states
    */
    constructor(private elementStore: ElementStore, private commands: TableElementCommands){
        this.elementStore.element.subscribe(element=> this.element = <TableElement>element)
    }

    //shorthand to get selected cells background color
    getCellBgColor(){
        return this.element.selectedCells[0].background_color
        
    }

    //shorthand to get selected cells text color
    getCellTextColor(){
        let color = this.element.selectedCells[0].text_color
        if(color){
            return color
        }else{
            return this.lastCellTextColor
        }
    }

    //shorthand to get selected cells border color
    getCellBColor(){
        let color = this.element.selectedCells[0].border_color
        if(color){
            return color
        }else{
            return this.lastCellBColor
        }
    }
    
    //shorthand to determine if selected cells have any background
    getSelectedCellsBackground(){
        if(this.element.selectedCells){
           return this.element.selectedCells.filter(cell => cell.background_color).length > 0 
       }else{
           return false
       }
    }

    /*calls command to change selected cells font
    @param 'font' - font to be changed
    */
    changeSelectedCellsFont(font: Font){
        this.commands.ChangeSCellsFont(this.element,font)
    }
    
    /*calls command to change selected cells font size
    @param 'size' - number to change font to (in px)
    */
   changeSelectedCellsFontSize(size: number){
        this.commands.changeSCellsFontSize(this.element,size)
    }
    
    /*calls command to toggle selected cells bold text appearance
    */
    changeSelectedCellsBold(){
        this.commands.changeSCellsBold(this.element)
        
    }
    
    /*calls command to toggle selected cells italic text appearance
    */
    changeSelectedCellsItalic(){
        this.commands.changeSCellsItalic(this.element)
    }
    
    /*calls command to set selected cells text alignement
    @param 'align' - css string value to set
    */
    changeSelectedCellsTextAlign(align: string){
        this.commands.changeSCellsTextAlign(this.element,align)
    }
    
    /*calls command to set selected cells text vertical alignement
    @param 'align' - css string value to set
    */
    changeSelectedCellsTextAlignVert(align: string){
        this.commands.changeSCellsTextAlignVert(this.element,align)
    }

    
    /*calls command to turn selected cells backround on or off
    @param 'value' - if background should be present or not
    */    
    toggleCellBackground(value: boolean){
        if(this.getCellBgColor()){
            this.commands.changeSCellsBackgroundColor(this.element, null)
        }else{
            this.commands.changeSCellsBackgroundColor(this.element, this.lastCellBgColor)
        }
    }

    /*calls command to change selected cells background color
    @param 'color' - css color to be set
    */    
    changeSelectedCellsBackgroundColor(color: string){
        this.lastCellBgColor = color
        if(this.getCellBgColor() &&  this.getCellBgColor() !== this.lastCellBgColor){
            this.commands.changeSCellsBackgroundColor(this.element, this.lastCellBgColor)
        }
    }
    
    /*calls command to change selected cells text color
    @param 'color' - css color to be set
    */ 
    changeSelectedCellsTextColor(color: string){
        this.lastCellTextColor = color
        this.commands.changeSCellsTextColor(this.element,color)
    }
    
    /*calls command to change selected cells border style
    @param 'style' - css style value to be set
    */ 
    changeSelectedCellsBorderStyle(style: string){
        this.commands.changeSCellsBorderStyle(this.element,style)
    }
    
    /*calls command to change selected cells border color
    @param 'color' - css color to be set
    */ 
    changeSelectedCellsBorderColor(color: string){
        this.lastCellBColor = color
        this.commands.changeSCellsBorderColor(this.element,color)
    }
    
    /*calls command to change selected cells border width
    @param 'width' - width to be set
    */ 
    changeSelectedCellsBorderWidth(width: number){
        this.commands.changeSCellsBorderW(this.element,width)
    }
    
    /*calls command to merge selected cells into one
    */ 
    mergeCells(){
        this.commands.mergeSCells(this.element)
    }
    
    //empty method used to trigger change detection
    onKey(){
        
    }
    
}