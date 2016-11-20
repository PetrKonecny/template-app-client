import { Component, Input, OnInit, HostListener} from '@angular/core';
import { NewTableCellComponent } from './new-table-cell.component'
import { TableElement } from './table-element'
import { RowContent } from './table-content'
import { Resizable } from './resizable.directive' 

@Component({
    selector: 'tr',
    template: `

                <template [ngIf]="element.clientState == 0">
                    <td *ngFor = "let cell of element.rows[y].cells; let x = index" [style.width.px]="cell.width" [style.text-align]="element.rows[y].cells[x].text_align"  [class.italic]="element.rows[y].cells[x].italic" [class.bold]="element.rows[y].cells[x].bold" [style.font-size.px]="element.rows[y].cells[x].font_size" [style.vertical-align]="element.rows[y].cells[x].vertical_align" [style.font-family]="'font' + element.rows[y].cells[x].font?.id">{{content.cells[x].text}}</td> 
                </template>
                <template [ngIf]="element.clientState == 2">
                    <td *ngFor = "let cell of element.rows[y].cells; let x = index" (mousedown)="onMousedown(x)" [style.width.px]="cell.width" resizable (resize)="resize($event)" [style.text-align]="element.rows[y].cells[x].text_align" [class.italic]="element.rows[y].cells[x].italic" [class.bold]="element.rows[y].cells[x].bold" [style.font-size.px]="element.rows[y].cells[x].font_size" [style.vertical-align]="element.rows[y].cells[x].vertical_align" [style.font-family]="'font' + element.rows[y].cells[x].font?.id">{{content.cells[x].text}}</td> 
                </template>
                <template [ngIf]="element.clientState == 3">
                    <td *ngFor = "let cell of element.rows[y].cells; let x = index" (mousemove)="onMousemove($event,x)" [style.width.px]="cell.width" [style.text-align]="element.rows[y].cells[x].text_align"  [class.italic]="element.rows[y].cells[x].italic" [class.bold]="element.rows[y].cells[x].bold" [class.selected]="element.rows[y].cells[x].selected" [style.font-size.px]="element.rows[y].cells[x].font_size" [style.vertical-align]="element.rows[y].cells[x].vertical_align" [style.font-family]="'font' + element.rows[y].cells[x].font?.id">{{content.cells[x].text}}</td> 
                </template>
                <template [ngIf]="element.clientState == 1">
                    <td *ngFor = "let cell of element.rows[y].cells; let x = index" [style.width.px]="cell.width"><textarea  *ngIf="element.clientState == 1" [(ngModel)]="content.cells[x].text" [style.text-align]="element.rows[y].cells[x].text_align"  [style.font-size.px]="element.rows[y].cells[x].font_size" [class.italic]="element.rows[y].cells[x].italic" [class.bold]="element.rows[y].cells[x].bold" [style.font-family]="'font' + element.rows[y].cells[x].font?.id"></textarea></td>
                </template>
        `
    ,
    directives: [Resizable], 
    styles: [`
        textarea{
            resize: none;
            background: none;
            border: none;
            width: inherit;
            height: inherit;
            overflow:hidden;
            font-family: inherit;
            font-size: inherit;
            text-align: inherit;
        }
        td {
            height: inherit;
            border: 1px solid black;
            border-collapse: collapse;
        }
        .selected{
            background-color: yellow;
        }
        .bold{
            font-weight: bold;
        }
        .italic{
            font-style: italic;
        }
    `]
})

       
export class NewTableRowComponent implements OnInit{
    
    @Input()
    element: TableElement;
    
    @Input()
    y: number;
    
    x: number;
    
    selecting: boolean
    
    @Input()
    content: RowContent
    
    @HostListener('document:mouseup', ['$event'])
    onDocMouseup(event) {    
        this.selecting = false
    }

    @HostListener('document:mousedown', ['$event'])
    onDocMousedown(event) {
        this.selecting = true
    }
    
    onMousemove(event: MouseEvent, x: number) {
        this.x = x
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
    
    onMousedown(x: number){
        this.x = x
    }
    
    fillFromDOM(){
    }    
    
    ngOnInit(){    
    }
}
