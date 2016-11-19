import { Component, Input, OnInit, HostListener} from '@angular/core';
import { Resizable } from './resizable.directive' 
import { TableElement } from './table-element'
import { CellContent } from './table-content'
@Component({
    selector: 'td',
    template: `
                <div *ngIf="element.clientState == 2" resizable (resize)="resize($event)" [style.font-size.px]="element.rows[y].cells[x].font_size">{{content.text}}</div>
                <div *ngIf="element.clientState == 0" [style.font-size.px]="element.rows[y].cells[x].font_size">{{content.text}}</div>
                <div *ngIf="element.clientState == 3" [class.selected]="element.rows[y].cells[x].selected" [style.font-size.px]="element.rows[y].cells[x].font_size">{{content.text}}</div>
                <textarea  *ngIf="element.clientState == 1" [(ngModel)]="content.text" [style.font-size.px]="element.rows[y].cells[x].font_size"></textarea>
    `
,
    directives: [Resizable],
    styles: [`
        div{
            height: inherit;
            overflow: hidden;
        }
        textarea{
            resize: none;
            background: none;
            border: none;
            width: 100%;
            height: 100%;
            overflow:hidden;
            font-family: inherit;
            font-size: inherit;
            text-align: inherit;
        }
        .selected{
            background-color: yellow;
        }
    `]
})

       
export class NewTableCellComponent implements OnInit{
        
    @Input()
    element: TableElement;
    
    @Input()
    x: number
    
    @Input()
    y: number
    
    @Input()
    content: CellContent
    
    selecting: boolean
    
    fillFromDOM(){
    }    
    
    @HostListener('document:mouseup', ['$event'])
    onMouseup(event) {    
        this.selecting = false
    }

    @HostListener('document:mousedown', ['$event'])
    onMousedown(event) {
        this.selecting = true
    }

    @HostListener('mousemove', ['$event'])
    onMousemove(event: MouseEvent) {
        if (this.selecting){
            if (!this.element.selectedCells) {
                this.element.selectedCells = new Array()
            }
            var cell = this.element.rows[this.y].cells[this.x]
            if (!cell.selected){
                this.element.selectCell(cell)
            }
        }
    }
    
    resize(dimensions: any){
        if(dimensions.width){
            for (var row of this.element.rows){
                row.cells[this.x].width += dimensions.width
            }
        }else if(dimensions.height){
            this.element.rows[this.y].height += dimensions.height
        }
    }
    
    ngOnInit(){
    }
}