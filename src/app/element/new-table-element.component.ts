import { Component, Input, OnInit, HostListener} from '@angular/core'
import { TableElement, TableElementCommands } from './table-element'
import { ElementDimensions} from '../resizable.directive'
import { NewPageRemote } from '../page/new-page.remote'
import { NewTableElement } from './new-table-element'
import { ElementCommands} from './element'
import { ElementStore } from '../element/element.store'

@Component({
    selector: 'create-new-table-element',
    template: `
        <div *ngIf="selected" style="position: absolute" [style.left.px] = "element.positionX" [style.top.px] = "element.positionY - 40">
        <button md-raised-button  md-icon-button [color]="element.clientState == 0? 'accent' : 'background'" (click)="element.clientState = 0"><md-icon>zoom_out_map</md-icon></button>
        <button md-raised-button  md-icon-button [color]="element.clientState == 1? 'accent' : 'background'"  (click)="element.clientState = 1">Ab</button>
        <button md-raised-button  md-icon-button [color]="element.clientState == 2? 'accent' : 'background'"  (click)="element.clientState = 2"><md-icon>vertical_align_center</md-icon></button>
        <span *ngIf="element.clientState ==2">
            <button md-icon-button [mdMenuTriggerFor]="resizeTableMenu"><md-icon>more_vert</md-icon></button>
            <md-menu #resizeTableMenu="mdMenu">
              <button md-menu-item (click)="addColumnLeft()" [disabled]="!element.selectedCells?.length == 1">
                <span>Add column to the left</span>
              </button>
              <button md-menu-item (click)="addColumnRight()" [disabled]="!element.selectedCells?.length == 1">
                <span>Add column to the right</span>
              </button>
              <button md-menu-item (click)="addRowBelow()" [disabled]="!element.selectedCells?.length == 1">
                <span>Add row below</span>
              </button>
              <button md-menu-item (click)="addRowAbove()" [disabled]="!element.selectedCells?.length == 1">
                <span>Add row above</span>
              </button>
              <button md-menu-item (click)="deleteColumn()" [disabled]="!element.selectedCells?.length == 1">
                <span>Delete column</span>
              </button>
              <button md-menu-item (click)="deleteRow()" [disabled]="!element.selectedCells?.length == 1">
                <span>Delete row</span>
              </button>
              <button md-menu-item>
                <span>Distribute rows</span>
              </button>
              <button md-menu-item>
                <span>Distribute columns</span>
              </button>              
            </md-menu>
        </span>
        <button md-raised-button  md-icon-button [color]="element.clientState == 3? 'accent' : 'background'"  (click)="element.clientState = 3"><md-icon>border_all</md-icon></button>
        <span *ngIf="element.clientState ==3">
            <button md-icon-button [mdMenuTriggerFor]="editCellsMenu"><md-icon>more_vert</md-icon></button>
            <md-menu #editCellsMenu="mdMenu">
              <button md-menu-item (click)="mergeCells()" [disabled]="element.selectedCells?.length <= 1">
                <span>Merge cells</span>
              </button>
              <button md-menu-item (click)="clearSelection()" [disabled]="!element.selectedCells?.length == 1">
                <span>Clear selection</span>
              </button>                       
            </md-menu>
        </span>      
        </div>
        <table *ngIf="element.clientState == 0" [class.selected]="selected" draggable2 (move)="move($event)" (click)="onElementClicked()" class= "inner" [style.left.px] = "element.positionX" [style.top.px] = "element.positionY">
            <tr *ngFor="let row of element.rows; let i = index" [myTr]="element" [y]="i" [style.height.px]="row.height" [content]="element.content.rows[i]" class="locked"></tr>
        </table>
        <table *ngIf="element.clientState == 1" [class.selected]="selected" class= "inner" [style.left.px] = "element.positionX" (click)="onElementClicked()"  [style.top.px] = "element.positionY">
            <tr *ngFor="let row of element.rows; let i = index" [myTr]="element" [y]="i"  [content]="element.content.rows[i]" [style.height.px]="row.height - 4"></tr>
        </table>
        <table *ngIf="element.clientState > 1" [class.selected]="selected" class= "inner" [style.left.px] = "element.positionX" (click)="onElementClicked()"  [style.top.px] = "element.positionY">
            <tr *ngFor="let row of element.rows; let i = index" [myTr]="element" [y]="i"  [content]="element.content.rows[i]" [style.height.px]="row.height"></tr>
        </table>
        `,
    styles:[`
        .inner {
        }
        .locked {
            pointer-events: none;
        }
        .button{
            z-index: 1000;
            position: absolute;
            margin-right: 10px;
        }
        table {
            position: absolute;
            table-layout: fixed;
        }
        table, td {
            border-collapse: collapse;
        }
        td {
            border: 1px solid black;
        }`
    ],
    providers: [NewTableElement]
})

       
export class NewTableElementComponent implements OnInit{
    
    @Input()
    element : TableElement
    counter: number
    selected: boolean
    
    move(dimensions: ElementDimensions){
        let d = this.newPage.move(this.element,dimensions)
        if(d){
            this.elementCommands.startMovingElement(this.element,d)
        }   
     }
    
    resize(dimensions: ElementDimensions){
    }

    ngDoCheck(){
        this.element.height = this.getTableHeight()
        this.element.width = this.getTableWidth()
    }
    
    @HostListener('mousedown', ['$event'])
    onMousedown(event) {
        this.counter = 0
    }

    getTableHeight(){
        let total = 0
        this.element.rows.forEach(row => total += row.height)
        return total
    }

    getTableWidth(){
        let total = 0
        this.element.rows.forEach(row => total += row.cells[0].width)
        return total
    }
    
    @HostListener('document:mousedown', ['$event'])
    onDocMousedown(event) {
    }
    
    constructor (
        private newPage: NewPageRemote, 
        private newTableElement: NewTableElement, 
        private tableElementCommands: TableElementCommands,  
        private elementCommands: ElementCommands,
        private elementStore: ElementStore,
    ){
        this.newTableElement.component = this
        this.elementStore.element.subscribe(element =>this.selected = this.element == element)
    }
    
    onElementClicked(){
    }

    addRowAbove(){
        if(this.element.selectedCells.length && this.element.selectedCells.length == 1){
            this.tableElementCommands.addRowAbove(this.element, this.element.selectedCells[0])
        }
    }

    addRowBelow(){
        if(this.element.selectedCells.length && this.element.selectedCells.length == 1){
            this.tableElementCommands.addRowBelow(this.element, this.element.selectedCells[0])
        }
    }

    addColumnRight(){
        if(this.element.selectedCells.length && this.element.selectedCells.length == 1){
            this.tableElementCommands.addColumnRight(this.element, this.element.selectedCells[0])
        }
    }

    addColumnLeft(){
        if(this.element.selectedCells.length && this.element.selectedCells.length == 1){
            this.tableElementCommands.addColumnLeft(this.element, this.element.selectedCells[0])
        }
    }

    deleteColumn(){
        if(this.element.selectedCells.length && this.element.selectedCells.length == 1){
            this.tableElementCommands.deleteColumn(this.element, this.element.selectedCells[0])
        }       
    }

    deleteRow(){
        if(this.element.selectedCells.length && this.element.selectedCells.length == 1){
            this.tableElementCommands.deleteRow(this.element, this.element.selectedCells[0])
        }
    }

    mergeCells(){
        if(this.element.selectedCells.length && this.element.selectedCells.length > 1){
            this.tableElementCommands.mergeSCells(this.element)
        }
    }

    clearSelection(){
        if(this.element.selectedCells.length){
            TableElement.clearSelectedCells(this.element)
        }
    }

    ngOnInit(){
        this.element.clientState = 0
    }
}