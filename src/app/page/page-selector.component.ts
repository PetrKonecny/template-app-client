import { Component, OnInit} from '@angular/core';
import { Image} from '../image/image';
import { Element } from '../element/element';
import { ElementSelector} from '../element/element-selector';
import {PageSelector} from './page-selector'
import {Page} from './page'
import {TextContent} from '../content/text-content'
import {ImageContent} from '../content/image-content'
import {TableContent} from '../content/table-content'
import {ImageElement} from '../element/image-element'
import {ArrayStepPush} from '../step-selector'
import {TextElement} from '../element/text-element'
import {StepSelector} from '../step-selector'
import {TableElement} from '../element/table-element'
import {TemplateInstanceStore} from '../template-instance/template-instance.store'
import {Guide} from '../guide/guide'
import {FrameElement} from '../element/frame-element'
import {ImageSelector} from '../image/image-selector'

@Component({
    selector: 'page-select',
    template: `
                <span *ngIf="page">\n\
                    <br>
                    <button (click)="createNewTextElement()">Add text element</button>
                    <button (click)="onAddImageButtonClick()">Add image element</button>\n\
                    <button (click)="createNewFrameElement()">Add frame element</button>
                    <button (click)="createNewTableElement()">Add table element</button>\n\
                    <button (click)="createNewRulerX()">Add vertical ruler</button>
                    <button (click)="createNewRulerY()">Add horizontal ruler</button>
                    <button (click)="onDeleteClicked()">Delete page</button>
                </span>
             `,
    providers: []
})

export class PageSelectorComponent {
        
    page: Page
    imagesOpened: boolean
    
    constructor(private pageSelector: PageSelector, private stepSelector: StepSelector,private templateInstanceStore: TemplateInstanceStore, private elementSelector: ElementSelector, private imageSelector: ImageSelector){
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
    
    createNewFrameElement(){
        if (this.page.elements == null) {
            this.page.elements = new Array<Element>();
        }
        var element = new FrameElement();
        element.width = 100;
        element.height = 100;
        element.positionX = 0;
        element.positionY = 0;
        element.content = new ImageContent();
        this.stepSelector.makeStep(new ArrayStepPush(element, this.page.elements))
        this.page.elements.push(element);
    }
    
    onAddImageButtonClick(){
        this.imageSelector.openSelectorWindow()
        let sub = this.imageSelector.selectorWindowOpened.take(1).subscribe() 
        this.imageSelector.image.takeWhile(image => !sub.closed).subscribe((image) => this.createNewImageElement(image))
    }
    
    createNewImageElement(image: Image){
        if (this.page.elements == null) {
            this.page.elements = new Array<Element>();
        }
        var element = new ImageElement();
        element.width = 100;
        element.height = 100;
        element.positionX = 0;
        element.positionY = 0;
        element.image = image
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