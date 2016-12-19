import { Component, OnInit} from '@angular/core';
import { ImageListComponent} from './image-list.component';
import { ImageService } from './image.service';
import { Image} from './image';
import { Element } from './element';
import { ElementSelector} from './element-selector';
import {UPLOAD_DIRECTIVES} from 'ng2-uploader/ng2-uploader';
import {FontSelector} from './font-selector';
import {FontSelectorComponent} from './font-selector.component';
import {FontService} from './font.service';
import {ClientState} from './table-element'
import {PageSelector} from './page-selector'
import {Page} from './page'
import {TextContent} from './text-content'
import {ImageContent} from './image-content'
import {TableContent} from './table-content'
import {ImageElement} from './image-element'
import {ArrayStepPush} from './step-selector'
import {TextElement} from './text-element'
import {StepSelector, FunctionStep} from './step-selector'
import {TableElement} from './table-element'
import {TemplateInstanceStore} from './template-instance.store'
import {Guide} from './guide'

@Component({
    selector: 'page-select',
    template: `
                <span *ngIf="page">\n\
                    <br>
                    <button (click)="createNewTextElement()">Add text element</button>
                    <button (click)="createNewImageElement()">Add image element</button>
                    <button (click)="createNewTableElement()">Add table element</button>\n\
                    <button (click)="createNewRulerX()">Add vertical ruler</button>
                    <button (click)="createNewRulerY()">Add horizontal ruler</button>
                    <button (click)="onDeleteClicked()">Delete page</button>
                </span>
             `,
    directives: [],
    providers: []
})

export class PageSelectorComponent {
        
    page: Page
    
    constructor(private pageSelector: PageSelector, private stepSelector: StepSelector,private templateInstanceStore: TemplateInstanceStore, private elementSelector: ElementSelector){
        this.pageSelector.component = this
    }
    
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
        this.stepSelector.makeStep(new ArrayStepPush(element, this.page.elements))
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
            this.stepSelector.makeStep(new ArrayStepPush(element, this.page.elements))
        this.page.elements.push(element);
    }
    
    createNewTableElement(){
        if (this.page.elements == null) {
            this.page.elements = new Array<Element>();
        }
        var element = new TableElement();
        element.width = 100
        element.height = 100
        element.positionX = 0
        element.positionY = 0
        TableElement.addRows(element,5,5)
        var content = new TableContent()
        content.addRows(5,5)
        element.content = content
        this.stepSelector.makeStep(new ArrayStepPush(element, this.page.elements))
        this.page.elements.push(element)
    }
    
    createNewRulerX(){
        if (this.page.rulers == null) {
            this.page.rulers = new Array<Guide>();
        }
        let ruler = new Guide
        ruler.positionX = 20
        this.page.rulers.push(ruler)
    }
    
    createNewRulerY(){
        if (this.page.rulers == null) {
            this.page.rulers = new Array<Guide>();
        }
        let ruler = new Guide
        ruler.positionY = 20
        this.page.rulers.push(ruler)
    }
    
    onDeleteClicked(){
        this.templateInstanceStore.deletePageFromTemplate(this.page);
        this.page = null
        this.elementSelector.selectedElement = null
    }
 
    
}