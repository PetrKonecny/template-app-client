import { Component, Input, OnInit, ElementRef} from '@angular/core';
import { Font } from './font';

@Component({
    selector: 'font-display',
    template: `
            <div>             
                <div>{{font.name}}</div>\n\
            </div> `,
    styles: [`        
                div{font-size: 20px;}
            `]
})

export class DisplayFontComponent implements OnInit{
     
    @Input()
    font : Font
    
    constructor(public elementRef: ElementRef){
    }
    
    /*
     * bypass of Angular framework should be done better
     */
    ngOnInit(){
        if(this.font.id){
            this.elementRef.nativeElement.children[0].style.fontFamily = "font"+this.font.id;
        }else if(this.font.name){
            this.elementRef.nativeElement.children[0].style.fontFamily = this.font.name;
        }
    }
   
}