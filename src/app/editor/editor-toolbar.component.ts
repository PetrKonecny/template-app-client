import { Component, OnInit , Input, OnChanges} from '@angular/core';
import { ImageService } from '../image/image.service';
import {FontService} from '../font/font.service';
import {Editor} from './editor'
import {Font} from '../font/font'
import { ElementStore } from '../element/element.store'
import {TextContent} from '../content/text-content'

@Component({
    selector: 'editor-toolbar',
    template: ` <span *ngIf="editor">
                    <font-toolbar (onFontSelected)="changeEditorFont($event)" (onFontSizeSelected)="changeEditorFontSize($event)" [fontLabel]="editor.editorCurFont.substring(0,5)" [fontSizeLabel]="editor.editorCurFontSize"></font-toolbar>
                    <button md-icon-button md-tooltip="barva písma" [mdMenuTriggerFor]="backgroundColorMenu"><md-icon  [style.color]="editor.editorCurColor">fiber_manual_record</md-icon></button>
                    <my-md-menu #backgroundColorMenu>
                        <div md-menu-item [colorPicker]="editor.editorCurColor" style="width: 230px; height: 290px; padding: 0 !important;" [cpOutputFormat]="hex" (colorPickerChange)="changeEditorTextColor($event)" [cpToggle]="true" [cpDialogDisplay]="'inline'" [cpAlphaChannel]="'disabled'">
                        </div>       
                    </my-md-menu>
                    <button md-icon-button [mdMenuTriggerFor]="textMenu"  mdTooltip="formát textu">F</button>
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

//displays custom toolbar for tiny-mce editor 
export class EditorToolbarComponent {
    
    //editor of currently selected text element
    editor: Editor  

    curColor: string
    
    
    /**
    @param elementStore - store containing selected element
    */
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
      
   //calls tiny-mce command to change font size   
   changeEditorFontSize(size: number){
        this.editor.editor.execCommand('fontSize',false,size+"px")       
    }
    
    //calls tiny-mce command to change font bold
    changeEditorTextBold(){
        this.editor.editor.execCommand("Bold")     
    }
    
    //calls tiny-mce command to change font italic
    changeEditorTextItalic(){
        this.editor.editor.execCommand("Italic")     
    }
    

    //calls tiny-mce command to change text format
    changeEditorFormatBlock(block: string){
        this.editor.editor.execCommand('FormatBlock', false , block)
    }
    
    //calls tiny-mce command to change editor font
    changeEditorFont(font: Font){
        let fontName = ""
        if(font.id){
            fontName = "font" + font.id
        }else if (font.name){
            fontName = font.name
        }
        this.editor.editor.execCommand('FontName',false,fontName)       
    }
    
    //calls tiny-mce command to change text align
    changeEditorTextAlign(align: string){
        this.editor.editor.execCommand(align)
    }
     
    //calls tiny-mce command to change text color
    changeEditorTextColor(color: string){
        this.editor.editor.execCommand('ForeColor', false, color);
    }
    
}