import { Component, Input, OnInit} from '@angular/core';
import { Resizable } from './resizable.directive' 
import { TableElement } from './table-element'
import { CellContent } from './table-content'
@Component({
    selector: 'td',
    template: `
                <div *ngIf="!element.locked && !element.editable" resizable (resize)="resize($event)" > Hello</div>
                <div *ngIf="element.locked && !element.editable">Hello</div>
                <textarea  *ngIf="element.locked && element.editable" [(ngModel)]="content.text"></textarea>
    `
,
    directives: [Resizable],
    styles: [`
        div{
            height: inherit;
        }
        textarea{
            min-height: 100%;
            min-width: 100%;
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
    
    fillFromDOM(){
    }    
    
    resize(dimensions: any){
        if(dimensions.width){
            this.element.cells[this.x].width += dimensions.width
        }else if(dimensions.height){
            this.element.rows[this.y].height += dimensions.height
        }
    }
    
    ngOnInit(){
    }
}