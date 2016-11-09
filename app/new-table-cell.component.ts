import { Component, Input, OnInit} from '@angular/core';
import { Resizable } from './resizable.directive' 
import { TableElement } from './table-element'

@Component({
    selector: 'td',
    template: `
                <div resizable (resize)="resize($event)" > Hello</div>
        `
,
    directives: [Resizable],
    styles: [`
        div{
            height: inherit;
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
    
    fillFromDOM(){
    }    
    
    resize(dimensions: any){
        console.log(dimensions.width,dimensions.height)
        if(dimensions.width){
            this.element.cells[this.x].width += dimensions.width
        }else if(dimensions.height){
            this.element.rows[this.y].height += dimensions.height
        }
    }
    
    ngOnInit(){
    }
}