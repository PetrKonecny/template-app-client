import { Component, Input, OnInit} from '@angular/core';
import { NewTableCellComponent } from './new-table-cell.component'

@Component({
    selector: 'tr',
    template: `
                <td *ngFor = "let width of widths" [width]="width" [style.width.px]="width"></td>
        `
,
    directives: [NewTableCellComponent]
})

       
export class NewTableRowComponent implements OnInit{
    
    @Input()
    widths: Array<number>;
  
    @Input()
    height: number;
    
    
    fillFromDOM(){
    }    
    
    ngOnInit(){
      
    }
}