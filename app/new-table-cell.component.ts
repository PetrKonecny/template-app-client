import { Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'td',
    template: `
                Hello
        `
,
    directives: []
})

       
export class NewTableCellComponent implements OnInit{
    
    @Input()
    widths: Array<number>;
  
    @Input()
    height: number;
    
    
    fillFromDOM(){
    }    
    
    ngOnInit(){
      
    }
}