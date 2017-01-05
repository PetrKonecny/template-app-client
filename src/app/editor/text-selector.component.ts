import { Component, OnInit , Input, OnChanges} from '@angular/core';
import { ImageService } from '../image/image.service';
import {FontSelector} from '../font/font-selector';
import {FontService} from '../font/font.service';
import {Editor} from './editor'
import {Font} from '../font/font'
import {TextSelector} from './text-selector'

@Component({
    selector: 'text-select',
    template: ` <div *ngIf="editor">
                    <span> Font: {{editor.editorCurFont}}</span>
                    <font-selector *ngIf="fontsOpened"></font-selector>
                    <button *ngIf="!fontsOpened" (click)="onChangeFontButtonClick()">Change font</button>
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
                </div>
             `,
    providers: [FontSelector]
})

export class TextSelectorComponent {
    
    fontsOpened : boolean;
    editor: Editor  
      
    curColor: string
    
    
    constructor(private textSelector: TextSelector, private fontSelector: FontSelector){
        this.textSelector.editor.subscribe(editor => this.editor = editor)
        this.fontSelector.selectorWindowOpened.subscribe(value => this.fontsOpened = value)
    }
      
    onCpToggleChange(toggle: boolean){
        if(!toggle){
            this.changeEditorTextColor(this.curColor)
        }
    }
    
    onChangeFontButtonClick(){
        this.fontSelector.openSelectorWindow()
        let sub = this.fontSelector.selectorWindowOpened.take(1).subscribe() 
        this.fontSelector.font.takeWhile(font => !sub.closed).subscribe((font) => this.textSelector.changeEditorFont(font))
    }
    
    changeEditorFontSize(size: number){
      
    }
    
    changeEditorTextBold(){
        this.textSelector.changeEditorTextBold()   
    }
    
    changeEditorTextItalic(){
        this.textSelector.changeEditorTextItalic()    
    }
    
    changeEditorFormatBlock(block: string){
        this.textSelector.changeEditorFormatBlock(block)
    }
    
    
    changeEditorTextAlign(align: string){
       this.textSelector.changeEditorTextAlign(align)
    }
     
    changeEditorTextColor(color: string){
        this.textSelector.changeEditorTextColor(color)
    }
    
}