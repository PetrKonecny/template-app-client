import { Component, OnInit , Input, OnChanges} from '@angular/core';
import { ImageService } from '../image/image.service';
import {FontSelector} from '../font/font-selector';
import {FontService} from '../font/font.service';
import {Editor} from './editor'
import {Font} from '../font/font'


@Component({
    selector: 'text-select',
    template: ` 
                <span> Font: {{editor.editorCurFont}}</span>
                <font-selector *ngIf="fontsOpened" (onFontSelected)="changeEditorFont($event)" ></font-selector>
                <button *ngIf="!fontsOpened" (click)="openFonts()">Change font</button>
                <br>Font color: <input [colorPicker]="editor.editorCurColor" (mousedown)="$event.preventDefault()" (colorPickerChange)="curColor =$event" (cpToggleChange)="onCpToggleChange($event)" [style.background]="editor.editorCurColor" />
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
    providers: [ImageService, FontSelector, FontService]
})

export class TextSelectorComponent implements OnInit, OnChanges {
    
    fontsOpened : boolean;
    
    @Input()
    editor: Editor
      
    curColor: string
    
    
    constructor(private fontSelector: FontSelector){
    }
      
    onCpToggleChange(toggle: boolean){
        if(!toggle){
            this.changeEditorTextColor(this.curColor)
        }
    }
    
    ngOnChanges(){
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
        this.editor.editor.execCommand("Bold")     
    }
    
    changeEditorTextItalic(){
        this.editor.editor.execCommand("Italic")     
    }
    
    changeEditorFormatBlock(block: string){
        this.editor.editor.execCommand('FormatBlock', false , block)
    }
    
    changeEditorFont(font: Font){
        this.editor.editor.execCommand('FontName',false,'font'+font.id)       
    }
    
    changeEditorTextAlign(align: string){
        this.editor.editor.execCommand(align)
    }
     
    changeEditorTextColor(color: string){
        this.editor.editor.execCommand('ForeColor', false, color);
    }
    
}