import { Component, Input, OnInit, ElementRef} from '@angular/core';
import { Font } from './font';

@Component({
    selector: 'font-display',
    template: `
            <div>             
                <div>{{font.name}}</div>\n\
            </div> `,
    styles: [`        
                div{font-size: 40px;}
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
        var newStyle = document.createElement('style');
        newStyle.appendChild(document.createTextNode("\
        @font-face {\
            font-family: '" +"font" + this.font.id + "';\
            src: url('"+"http://localhost:8080/font/"+this.font.id +"/file" +"');\
        }\
        "));

        document.head.appendChild(newStyle);
        this.elementRef.nativeElement.children[0].style.fontFamily = "font"+this.font.id;
    }
   
}