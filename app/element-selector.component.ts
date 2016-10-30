import { Component, OnInit} from '@angular/core';
import { ImageListComponent} from './image-list.component';
import { ImageService } from './image.service';
import { Image} from './image';
import { Element } from './element';
import { ElementSelector} from './element-selector';
import {UPLOAD_DIRECTIVES} from 'ng2-uploader/ng2-uploader';
import {FontSelector} from './font-selector';
import {FontSelectorComponent} from './font-selector.component';
import {FontService} from './font.service';

@Component({
    selector: 'element-select',
    template: `
                <span *ngIf="elementSelector.selectedComponent"> 
                <br><b>Element ID: {{element.id}}</b><br>
                <button (click)="deleteElement()">Delete element</button>
                Width: <input [(ngModel)]="elementSelector.selectedComponent.elementRef.nativeElement.children[0].style.width"  (keyup)="0"><br>
                Height: <input [(ngModel)]="elementSelector.selectedComponent.elementRef.nativeElement.children[0].style.height"  (keyup)="0"><br>
                Position X: <input [(ngModel)]="elementSelector.selectedComponent.elementRef.nativeElement.children[0].style.left"   (keyup)="0"><br>
                Position Y: <input [(ngModel)]="elementSelector.selectedComponent.elementRef.nativeElement.children[0].style.top"   (keyup)="0">
                <div *ngIf="element.type == 'text_element'">
                    <span *ngIf="element.font"> Font: {{element.font.name}}</span>
                    <font-selector *ngIf="fontsOpened" ></font-selector>
                    <button *ngIf="!fontsOpened" (click)="openFonts()">Change font</button>
                    <br>Font size: <input [(ngModel)]="elementSelector.selectedComponent.elementRef.nativeElement.children[0].style.fontSize" (keyup)="0">
                    <div>
                        <h2>Text align</h2><br>
                        <button (click)="changeTextAlign('left')">Allign left</button>
                        <button (click)="changeTextAlign('right')">Allign right</button>
                        <button (click)="changeTextAlign('center')">Allign center</button>
                        <button (click)="changeTextAlign('justify')">Justify</button>
                    </div>
                    <div>
                        <h2>Vertical text align</h2><br>
                        <button (click)="changeTextAlignVertical('middle')">Allign middle</button>
                        <button (click)="changeTextAlignVertical('top')">Allign top</button>
                        <button (click)="changeTextAlignVertical('bottom')">Allign bottom</button>
                    </div>
                </div>
                </span>
             `,
    directives: [ImageListComponent, FontSelectorComponent, UPLOAD_DIRECTIVES],
    providers: [ImageService, FontSelector, FontService]
})

export class ElementSelectorComponent implements OnInit {
    
    element : Element;
    fontsOpened : boolean;
    
    constructor(private elementSelector: ElementSelector, private fontSelector: FontSelector){}
    
    ngOnInit(){
        this.elementSelector.selectedElement.subscribe(element => {
            this.element = element                 
        });
        this.fontSelector.selectorWindowOpened.subscribe(opened => this.fontsOpened = opened)
    }
    
    openFonts(){
        this.fontSelector.openSelectorWindow()
    }
    
    deleteElement(){
        this.elementSelector.deleteElement();
    }
     
    changeTextAlign(align: string){
        this.elementSelector.changeTextAlign(align)
    }
    
    changeTextAlignVertical(align: string){
        this.elementSelector.changeTextAlignVertical(align)
    }
    
    onKey(){
        
    }
    
}