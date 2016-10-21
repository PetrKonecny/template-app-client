import { Component, OnInit, Input, ViewChild, QueryList, OnChanges} from '@angular/core';
import { Content} from './content';
import { TextContent } from './text-content'
import { NewElementComponent } from './new-element.component';
import { TemplateInstanceStore} from './template-instance.store'

@Component({
    selector: 'display-content',
    template:
    `   <div *ngIf="content.type === 'text_content'" #textBox class="content" contenteditable="true">
            <span>{{content.text}}</span>
        </div>
        <div *ngIf="content.type === 'image_content'" class="content">
            <img *ngIf="content.image" class="image" src="http://localhost:8080/img/{{content.image.image_key}}.{{content.image.extension}}">
        </div>
    `,
    styles:[`
        .element {
            background-color: white;
        }
        .content {
            min-height: 20px;
        }
    `],
    directives: []
})

export class DisplayContentComponent implements OnChanges {

    @Input()
    content: Content;
    
    @ViewChild('textBox')
    child: any;   
    
    ngOnChanges(){
        console.log(this.content);
    }
    
    saveContent(){
        if(this.content.type == 'text_content'){
            (<TextContent> this.content).text = this.child.nativeElement.textContent;
            this.child.nativeElement.textContent = (<TextContent>this.content).text;
        }
    }
   
}