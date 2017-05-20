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

/** Displays the font model in its font 
*/
export class DisplayFontComponent implements OnInit{
     
    @Input()
    //font to be displayed
    font : Font
    
    /**
    @param elementRef - injects reference to the root elemnt of this component
    */
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