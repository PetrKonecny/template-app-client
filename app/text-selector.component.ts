import { Component, OnInit, ChangeDetectorRef , Input} from '@angular/core';
import { ImageListComponent} from './image-list.component';
import { ImageService } from './image.service';
import { Image} from './image';
import { Element } from './element';
import { TextElement } from './text-element';
import { ElementSelector} from './element-selector';
import {UPLOAD_DIRECTIVES} from 'ng2-uploader/ng2-uploader';
import {FontSelector} from './font-selector';
import {FontSelectorComponent} from './font-selector.component';
import {FontService} from './font.service';
import {ClientState, TableElement, Cell} from './table-element'
import {ColorPickerDirective} from 'ct-angular2-color-picker/component'
import {TextContent} from './text-content'


@Component({
    selector: 'text-select',
    template: ` 
                <span> Font: Some font</span>
                <font-selector *ngIf="fontsOpened" ></font-selector>
                <button *ngIf="!fontsOpened" (click)="openFonts()">Change font</button>
                <br>Font color: <input [colorPicker]="content.editor.editorCurColor" (colorPickerChange)="changeEditorTextColor($event)" [style.background]="content.editor.editorCurColor" />
                <div>
                    <h2>Text align</h2><br>
                    <button (click)="changeEditorTextAlign('left')">Allign left</button>
                    <button (click)="changeEditorTextAlign('right')">Allign right</button>
                    <button (click)="changeEditorTextAlign('center')">Allign center</button>
                    <button (click)="changeEditorTextAlign('justify')">Justify</button>
                </div>                    
             `,
    directives: [FontSelectorComponent, UPLOAD_DIRECTIVES, ColorPickerDirective],
    providers: [ImageService, FontSelector, FontService]
})

export class TextSelectorComponent implements OnInit {
    
    fontsOpened : boolean;
    
    @Input()
    content: TextContent
      
    constructor(private fontSelector: FontSelector){
    }
    
    ngOnInit(){
        this.fontSelector.selectorWindowOpened.subscribe(opened => this.fontsOpened = opened)
    }
    
    openFonts(){
    }
    
    changeEditorFontSize(size: number){
      
    }
    
    changeEditorTextBold(bold: boolean){
        this.content.editor.editor.execCommand("Bold")     
    }
    
    changeEditorTextItalic(italic: boolean){
    }
    
    changeEditorTextAlign(align: string){
    
    }
     
    changeEditorTextColor(color: string){
        this.content.editor.editor.execCommand('ForeColor', false, color);
    }
    
}