import { Component, OnInit, Input, ViewChildren, QueryList} from '@angular/core';
import { Element} from './element';
import { TextElement } from './text-element';
import { ImageElement } from './image-element';
import { Page} from './page';
import { NewElementComponent } from './new-element.component';
//import { NgGrid, NgGridItem } from 'angular2-grid';
import { TextContent } from './text-content'
import { ImageContent } from './image-content'

@Component({
    selector: 'create-new-page',
    template: `
          <h3>New Page</h3>\n\
          <div class ="page">
            <div class="grid">
                  <create-new-element *ngFor="let element of page.elements" [element] = "element" ></create-new-element>
            </div>
          </div>
          <button (click)="createNewTextElement()">Add text element</button>
          <button (click)="createNewImageElement()">Add image element</button>
    `,
    styles:[`
        .grid {
            min-width: 100%;
            min-height: 100%;
        }
        .page {\n\
            position: relative;
            width: 210mm;
            height: 297mm;
        }
    `],
    directives: [NewElementComponent]
})

export class NewPageComponent  {

    @Input()
    page: Page = new Page();
    
    @ViewChildren(NewElementComponent)
    elementsComponents : QueryList<NewElementComponent>;
    
    createNewTextElement(){
        if (this.page.elements == null) {
            this.page.elements = new Array<Element>();
        }
        var element = new TextElement();
        element.width = 100;
        element.height = 100;
        element.positionX = 0;
        element.positionY = 0;
        element.font_size = 20;
        element.content = new TextContent();
        this.page.elements.push(element);
    }
    
    createNewImageElement(){
        if (this.page.elements == null) {
            this.page.elements = new Array<Element>();
        }
        var element = new ImageElement();
        element.width = 100;
        element.height = 100;
        element.positionX = 0;
        element.positionY = 0;
        element.content = new ImageContent();
        this.page.elements.push(element);
    }
    
    fillFromDOM(){
        this.elementsComponents.toArray().forEach((child) => child.fillFromDOM());
    }

}