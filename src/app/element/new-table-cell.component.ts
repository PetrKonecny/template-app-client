import { Component, Input, OnInit, HostListener, ElementRef, Inject} from '@angular/core';
import { TableElement } from './table-element'
import { CellContent } from '../content/table-content'
@Component({
    selector: '[myComponent]',
    template: `
                <td *ngIf="element.clientState == 2" resizable (resize)="resize($event)" [style.text-align]="element.rows[y].cells[x].text_align" [class.italic]="element.rows[y].cells[x].italic" [class.bold]="element.rows[y].cells[x].bold" [style.font-size.px]="element.rows[y].cells[x].font_size">{{content.text}}</td>
                <td *ngIf="element.clientState == 0" [style.text-align]="element.rows[y].cells[x].text_align"  [class.italic]="element.rows[y].cells[x].italic" [class.bold]="element.rows[y].cells[x].bold" [style.font-size.px]="element.rows[y].cells[x].font_size">{{content.text}}</td>
                <td *ngIf="element.clientState == 3" [style.text-align]="element.rows[y].cells[x].text_align"  [class.italic]="element.rows[y].cells[x].italic" [class.bold]="element.rows[y].cells[x].bold" [class.selected]="element.rows[y].cells[x].selected" [style.font-size.px]="element.rows[y].cells[x].font_size">{{content.text}}</td>
                <td><textarea  *ngIf="element.clientState == 1" [(ngModel)]="content.text" [style.text-align]="element.rows[y].cells[x].text_align"  [style.font-size.px]="element.rows[y].cells[x].font_size" [class.italic]="element.rows[y].cells[x].italic" [class.bold]="element.rows[y].cells[x].bold"></textarea></td>
    `
,
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
        .bold{
            font-weight: bold;
        }
        .italic{
            font-style: italic;
        }
    `]
})

       
export class NewTableCellComponent implements OnInit{
        
    @Input()
    element: TableElement;
    
    @Input('myTd') td;
    
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
                TableElement.selectCell(this.element,cell)
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