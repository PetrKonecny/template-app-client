import { Component, Input, OnInit, HostListener} from '@angular/core';
import { TableElement} from './table-element'
import { ElementDimensions} from '../resizable.directive'
import { ElementSelector } from './element-selector'
import { NewPage } from '../page/new-page'
import { NewTableElement } from './new-table-element'

@Component({
    selector: 'create-new-table-element',
    template: `
        <table *ngIf="element.clientState == 0" draggable2 resizable (resize)="resize($event)" (move)="move($event)" (click)="onElementClicked()" class= "inner" [style.left.px] = "element.positionX" [style.top.px] = "element.positionY">
            <tr *ngFor="let row of element.rows; let i = index" [element]="element" [y]="i" [style.height.px]="row.height" [content]="element.content.rows[i]" class="locked"></tr>
        </table>
        <table *ngIf="element.clientState > 0" class= "inner" [style.left.px] = "element.positionX" (click)="onElementClicked()"  [style.top.px] = "element.positionY">
            <tr *ngFor="let row of element.rows; let i = index" [element]="element" [y]="i"  [content]="element.content.rows[i]" [style.height.px]="row.height"></tr>
        </table>     
        `,
    styles:[`
        .inner {
            position: absolute;
            overflow: hidden;         
            background-color: rgba(0, 0, 0, 0.25);
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
            table-layout: fixed;
        }
        table, td {
            border: 1px solid black;
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
    
    move(dimensions: ElementDimensions){
        this.newPage.move(this.element,dimensions)
    }
    
    resize(dimensions: ElementDimensions){
        this.newPage.resizeTableElement(this.element,dimensions)      
    }
    
    @HostListener('mousedown', ['$event'])
    onMousedown(event) {
        this.counter = 0
    }
    
    @HostListener('document:mousedown', ['$event'])
    onDocMousedown(event) {
    }
    
    constructor (private elementSelector: ElementSelector, private newPage: NewPage, private newTableElement: NewTableElement){
        this.newTableElement.component = this
    }
    
    onElementClicked(){
        this.elementSelector.changeElement(this.element)
    }
  
    fillFromDOM(){
    }    
    
    ngOnInit(){
        this.element.clientState = 0
    }
}