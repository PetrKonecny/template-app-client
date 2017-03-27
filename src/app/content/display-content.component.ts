import { Component, Input, ViewChild, ElementRef, DoCheck, KeyValueDiffer, KeyValueDiffers, EventEmitter, Output} from '@angular/core';
import { Content } from './content';
import { TextContent, TextContentCommands } from './text-content'
import { AppConfig } from '../app.config'
import { ImageContent } from '../content/image-content'
import {Image} from '../image/image'

@Component({
    selector: 'display-content',
    template:        
    `   <simple-tiny *ngIf="content.type === 'text_content'" 
            [content]="content"
            (onEditorKeyup)="keyupHandlerFunction($event)"
            clasś="content text"
        >
        </simple-tiny>
        <div *ngIf="content.type === 'image_content'" #frame [style.margin-left.px]="content.left" [style.margin-top.px]="content.top" class="content image" [style.width.px]="content.width" [style.height.px]="content.height" >
            <image *ngIf="content?.image" (loaded)="onLoad($event)" (loadingError)="onError($event)" [image]="content.image"></image>
        </div>
    `,
    styles:[`
        .element {
            background-color: white;
        }
        .content {
        }
        .image{
            pointer-events: none;
        }
        .text{
            min-height: 100%;
            min-width: 100%;
            resize: none;
            background: none;
            width: 100%;
            height: 100%;
            overflow:hidden;
            user-select: none;
            font-family: inherit;
            font-size: inherit;
            text-align: inherit;
            color: inherit;
        }
    `],
})

export class DisplayContentComponent {
    @Input()
    content: Content;
    @ViewChild('textBox')
    child: any;   
    
    @ViewChild('image')
    image: ElementRef;
    
    @ViewChild('frame')
    frame: ElementRef; 

    @Output()
    loaded = new EventEmitter

    @Output()
    loadingError = new EventEmitter

    loading = true
    
    keyupHandlerFunction(text: string){
        let content =<TextContent> this.content
        this.commands.changeText(content, text)
    }

    onLoad(image: Image){
        let content = <ImageContent> this.content
        if(!content.width && !content.height){
            content.width = image.originalWidth
            content.height = image.originalHeight
        }
        this.loaded.emit(image)
    }

    onError(){
        this.loadingError.emit()
    }

    getSubject(){
        return this.content
    }

    constructor(
        private config: AppConfig,
        private commands: TextContentCommands
    ){}
    
    saveContent(){
        /*if(this.content.type == 'text_content'){
            (<TextContent> this.content).text = this.child.nativeElement.textContent;
            this.child.nativeElement.textContent = (<TextContent>this.content).text;
        }
        if(this.content.type == 'image_content'){
            var content = <ImageContent>this.content;
            if(this.image){
                content.width = this.image.nativeElement.width;
                content.height = this.image.nativeElement.height; 
                content.left = this.styleToNum(this.frame.nativeElement.style.left);
                content.top = this.styleToNum(this.frame.nativeElement.style.top);
            }
        }*/
    }


    
    styleToNum(style){
        return Number(style.substring(0, style.length - 2));
    }
    
    
   
}
