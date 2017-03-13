import { Component, OnInit , Input, OnChanges} from '@angular/core';
import { ImageService } from '../image/image.service';
import {FontSelector} from '../font/font-selector';
import {FontService} from '../font/font.service';
import {Editor} from './editor'
import {Font} from '../font/font'
import {TextSelector} from './text-selector'

@Component({
    selector: 'text-select',
    template: ` <span *ngIf="editor">
                    <font-selector [fontLabel]="editor.editorCurFont.substring(0,5)" [fontSizeLabel]="editor.editorCurFontSize"></font-selector>
                    <button style="background: none; border:none;" [colorPicker]="editor.editorCurColor" (mousedown)="$event.preventDefault()" (colorPickerChange)="curColor =$event" (cpToggleChange)="onCpToggleChange($event)"><button md-icon-button><md-icon [style.color]="editor.editorCurColor">format_color_text</md-icon></button></button>
                    <button md-icon-button [mdMenuTriggerFor]="textMenu"  mdTooltip="Format text">F</button>
                    <my-md-menu #textMenu="mdMenu">
                        <button md-icon-button (click)="changeEditorTextAlign('JustifyLeft')" mdTooltip="zarovnat doleva"><md-icon>format_align_left</md-icon></button>
                        <button md-icon-button (click)="changeEditorTextAlign('JustifyRight')" mdTooltip="zarovnat doprava"><md-icon>format_align_right</md-icon></button>
                        <button md-icon-button (click)="changeEditorTextAlign('JustifyCenter')" mdTooltip="zarovnat na střed"><md-icon>format_align_center</md-icon></button>
                        <button md-icon-button (click)="changeEditorTextAlign('JustifyFull')" mdTooltip="zarovnat do bloku"><md-icon>format_align_justify</md-icon></button>
                        <button md-icon-button (click)="changeEditorTextBold()" mdTooltip="tučné"><md-icon>format_bold</md-icon></button>
                        <button md-icon-button (click)="changeEditorTextItalic()" mdTooltip="kurzíva"><md-icon>format_italic</md-icon></button>
                        <button md-icon-button (click)="changeEditorFormatBlock('h1')" mdTooltip="nadpis 1">H1</button>
                        <button md-icon-button (click)="changeEditorFormatBlock('h2')" mdTooltip="nadpis 2">H2</button>
                        <button md-icon-button (click)="changeEditorFormatBlock('p')" mdTooltip="odstavec">P</button>
                    </my-md-menu>
                </span>
             `,
    providers: [FontSelector]
})

export class TextSelectorComponent {
    
    fontsOpened : boolean;
    editor: Editor  
    fontSizes=[10,20,30,40,50]
    curColor: string
    
    
    constructor(private textSelector: TextSelector, private fontSelector: FontSelector){
        this.textSelector.editor.subscribe(editor => this.editor = editor)
        this.fontSelector.font.subscribe(font => this.textSelector.changeEditorFont(font))
        this.fontSelector.fontSize.subscribe(fontSize => this.textSelector.changeEditorFontSize(fontSize))
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