import { Component, OnInit, Input, ViewChild, QueryList} from '@angular/core';
import { Content} from './content';
import { TextContent } from './text-content'
import { NewElementComponent } from './new-element.component';
import { TemplateInstanceStore} from './template-instance.store'

@Component({
    selector: 'display-content',
    template:
    `
        <div *ngIf="content.type === 'text_content'" #textBox class="content" contenteditable="true">
            <span>{{content.text}}</span>
        </div>
        <div *ngIf="content.type === 'image_content'" #textBox class="content">
            <img *ngIf="content.image" class="image" src="http://localhost:8080/img/{{content.image.image_key}}.{{content.image.extension}}">
        </div>
    `,
    styles:[`
        .element {
            background-color: white;
        }
    `],
    directives: [NewElementComponent]
})

export class DisplayContentComponent {

    @Input()
    content: Content;
    
    @ViewChild('textBox')
    child: any;
    
    saveContent(){
        console.log(this.child);
        if(this.content.type == 'text_content'){
            console.log(this.content);
            (<TextContent> this.content).text = this.child.nativeElement.textContent;
            this.child.nativeElement.textContent = (<TextContent>this.content).text;
        }
        console.log(this.content);
    }
   
}