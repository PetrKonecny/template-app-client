import { Component, Input, ViewChild, ElementRef, DoCheck, KeyValueDiffer, KeyValueDiffers} from '@angular/core';
import { Content} from './content';
import { TextContent } from './text-content'
import {StepSelector, StateChangeRespond} from '../step-selector'

@Component({
    selector: 'display-content',
    template:        
    `   <simple-tiny *ngIf="content.type === 'text_content'" 
            [content]="content"
            (onEditorKeyup)="keyupHandlerFunction($event)"
            clasś="content text"
        >
        </simple-tiny>
        <div *ngIf="content.type === 'image_content'" #frame [style.left.px]="content.left" [style.top.px]="content.top" class="content image">
            <img *ngIf="content.image && content.width && content.height" #image [width]="content.width" [height]="content.height" class="image" src="http://localhost:8080/img/{{content.image.image_key}}.{{content.image.extension}}">\n\
            <img *ngIf="content.image &&!content.width && !content.height" #image class="image" src="http://localhost:8080/img/{{content.image.image_key}}.{{content.image.extension}}">
        </div>
    `,
    styles:[`
        .element {
            background-color: white;
        }
        .content {
            position: absolute;         
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

export class DisplayContentComponent implements DoCheck, StateChangeRespond {
    @Input()
    content: Content;
    @ViewChild('textBox')
    child: any;   
    
    @ViewChild('image')
    image: ElementRef;
    
    @ViewChild('frame')
    frame: ElementRef; 

    continuousChangeRunning : boolean = false
    differ: KeyValueDiffer;  
    
    keyupHandlerFunction(text: string){
        let content =<TextContent> this.content
        content.text = text
    }

    getSubject(){
        return this.content
    }

    ngDoCheck(){
        var changes = this.differ.diff(this.content);
        if(changes) {
            this.stateService.respond(changes,this)           
        }
        
    }

    constructor(
        private differs: KeyValueDiffers,
        private stateService: StepSelector
    ){
        this.differ = differs.find({}).create(null);
    }
    
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
