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
import {Font} from './font'


@Component({
    selector: 'text-select',
    template: ` 
                <span> Font: {{content.editor.editorCurFont}}</span>
                <font-selector *ngIf="fontsOpened" (onFontSelected)="changeEditorFont($event)" ></font-selector>
                <button *ngIf="!fontsOpened" (click)="openFonts()">Change font</button>
                <br>Font color: <input [colorPicker]="content.editor.editorCurColor" (colorPickerChange)="changeEditorTextColor($event)" [style.background]="content.editor.editorCurColor" />
                <div>
                    <button (click)="changeEditorTextAlign('JustifyLeft')">Allign left</button>
                    <button (click)="changeEditorTextAlign('JustifyRight')">Allign right</button>
                    <button (click)="changeEditorTextAlign('JustifyCenter')">Allign center</button>
                    <button (click)="changeEditorTextAlign('JustifyFull')">Justify</button>
                </div>
                <div><button (click)="changeEditorTextBold()">Bold</button><button (click)="changeEditorTextItalic()">Italic</button>
                </div>
                <div>
                    <button (click)="changeEditorFormatBlock('h1')">H1</button>
                    <button (click)="changeEditorFormatBlock('h2')">H2</button>
                    <button (click)="changeEditorFormatBlock('p')">P</button>
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
        this.fontSelector.openSelectorWindow()
    }
    
    changeEditorFontSize(size: number){
      
    }
    
    changeEditorTextBold(){
        this.content.editor.editor.execCommand("Bold")     
    }
    
    changeEditorTextItalic(){
        this.content.editor.editor.execCommand("Italic")     
    }
    
    changeEditorFormatBlock(block: string){
        this.content.editor.editor.execCommand('FormatBlock', false , block)
    }
    
    changeEditorFont(font: Font){
        this.content.editor.editor.execCommand('FontName',false,'font'+font.id)       
    }
    
    changeEditorTextAlign(align: string){
        this.content.editor.editor.execCommand(align)
    }
     
    changeEditorTextColor(color: string){
        this.content.editor.editor.execCommand('ForeColor', false, color);
    }
    
}