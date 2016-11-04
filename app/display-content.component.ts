import { Component, Input, ViewChild, ElementRef} from '@angular/core';
import { Content} from './content';
import { TextContent } from './text-content'
import { ImageContent } from './image-content'

@Component({
    selector: 'display-content',
    template:
    `   <textarea *ngIf="content.type === 'text_content'"[(ngModel)]='content.text' #textBox class="content text">
            {{content.text}}
        </textarea>
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
            font-family: inherit;
            font-size: inherit;
            text-align: inherit;
        }
    `],
    directives: []
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