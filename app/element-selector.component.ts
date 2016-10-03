import { Component, OnInit} from '@angular/core';
import { ImageListComponent} from './image-list.component';
import { ImageService } from './image.service';
import { Image} from './image';
import { Element } from './element';
import { ElementSelector} from './element-selector';
import {UPLOAD_DIRECTIVES} from 'ng2-uploader/ng2-uploader';

@Component({
    selector: 'element-select',
    template: `<br><b>Element ID: {{element.id}}</b><br>
                <span *ngIf="elementSelector.selectedComponent"> 
                Width: <input [(ngModel)]="elementSelector.selectedComponent.elementRef.nativeElement.children[0].style.width"  (keyup)="0"><br>
                Height: <input [(ngModel)]="elementSelector.selectedComponent.elementRef.nativeElement.children[0].style.height"  (keyup)="0"><br>
                Position X: <input [(ngModel)]="elementSelector.selectedComponent.elementRef.nativeElement.children[0].style.left"   (keyup)="0"><br>
                Position Y: <input [(ngModel)]="elementSelector.selectedComponent.elementRef.nativeElement.children[0].style.top"   (keyup)="0">
                </span>
             `,
    directives: [ImageListComponent,UPLOAD_DIRECTIVES],
    providers: [ImageService]
})

export class ElementSelectorComponent implements OnInit {
    
    element : Element;
    
    constructor(private elementSelector: ElementSelector){}
    
    ngOnInit(){
        this.elementSelector.selectedElement.subscribe(element => {
            this.element = element                 
        });
    }
    
    onKey(){
        
    }
    
}