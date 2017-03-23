import { Component, OnInit , Input, OnChanges} from '@angular/core';
import { ImageService } from '../image/image.service';
import {FontService} from '../font/font.service';
import {Editor} from './editor'
import {Font} from '../font/font'
import { ElementStore } from '../element/element.store'
import {TextContent} from '../content/text-content'

@Component({
    selector: 'text-select',
    template: ` <span *ngIf="editor">
                    <font-selector (onFontSelected)="changeEditorFont($event)" (onFontSizeSelected)="changeEditorFontSize($event)" [fontLabel]="editor.editorCurFont.substring(0,5)" [fontSizeLabel]="editor.editorCurFontSize"></font-selector>
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
})

export class TextSelectorComponent {
    
    fontsOpened : boolean;
    editor: Editor  
    fontSizes=[10,20,30,40,50]
    curColor: string
    
    
    constructor(private elementStore: ElementStore){
        this.elementStore.element.subscribe(element => {
            if(element  && element.content && element.content.type == 'text_content'){
                let content = <TextContent> element.content
                if(content.editor){
                    this.editor = content.editor
                }
            }
        })
    }
      
    onCpToggleChange(toggle: boolean){
        if(!toggle){
            this.changeEditorTextColor(this.curColor)
        }
    }
    
   changeEditorFontSize(size: number){
        this.editor.editor.execCommand('fontSize',false,size+"px")       
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
        let fontName = ""
        if(font.id){
            fontName = "font" + font.id
        }else if (font.name){
            fontName = font.name
        }
        this.editor.editor.execCommand('FontName',false,fontName)       
    }
    
    changeEditorTextAlign(align: string){
        this.editor.editor.execCommand(align)
    }
     
    changeEditorTextColor(color: string){
        this.editor.editor.execCommand('ForeColor', false, color);
    }
    
}