import {Injectable} from '@angular/core';
import { Image} from '../image/image';
import { Element } from '../element/element';
import { ElementSelector} from '../element/element-selector';
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
import {BehaviorSubject, Observable} from 'rxjs/Rx'

@Injectable()
export class PageSelector {
    
  
	private _page: BehaviorSubject<Page> = new BehaviorSubject(null);
    public page: Observable<Page> = this._page.asObservable();    

    constructor(private stepSelector: StepSelector,  private templateInstanceStore: TemplateInstanceStore, private elementSelector: ElementSelector){}
    
    selectPage(page: Page){
    	if(!page) {return}
        this._page.next(page)
    }

    clearSelect(){
    	this._page.next(null)
    }

    createNewTextElement(){
    	let page = this._page.value
        if (page.elements == null) {
            page.elements = new Array<Element>();
        }
        var element = new TextElement();
        element.width = 100;
        element.height = 100;
        element.positionX = 0;
        element.positionY = 0;
        element.font_size = 20;
        let content = new TextContent()
        content.text = "<p></p>"
        element.content = content
        element.background_color = TextElement.defaultBackgroundColor
        let array = new Array().concat(page.elements)
        array.push(element)
        page.elements = array
    }
    
    createNewFrameElement(){
    	let page = this._page.value
        if (page.elements == null) {
            page.elements = new Array<Element>();
        }
        var element = new FrameElement();
        element.width = 100;
        element.height = 100;
        element.positionX = 0;
        element.positionY = 0;
        element.content = new ImageContent();
        this.stepSelector.makeStep(new ArrayStepPush(element, page.elements))
        page.elements.push(element);
    }    
    
    createNewImageElement(image: Image){
    	if(!image){return}
    	let page = this._page.value
        if (page.elements == null) {
            page.elements = new Array<Element>();
        }
        var element = new ImageElement();
        element.width = 100;
        element.height = 100;
        element.positionX = 0;
        element.positionY = 0;
        element.image = image
        this.stepSelector.makeStep(new ArrayStepPush(element, page.elements))
        page.elements.push(element);        
    }
    
    createNewTableElement(){
    	let page = this._page.value
        if (page.elements == null) {
            page.elements = new Array<Element>();
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
        this.stepSelector.makeStep(new ArrayStepPush(element, page.elements))
        page.elements.push(element)
    }
    
    createNewRulerX(){
    	let page = this._page.value
        if (page.rulers == null) {
            page.rulers = new Array<Guide>();
        }
        let ruler = new Guide
        ruler.positionX = 20
        page.rulers.push(ruler)
    }
    
    createNewRulerY(){
    	let page = this._page.value
        if (page.rulers == null) {
            page.rulers = new Array<Guide>();
        }
        let ruler = new Guide
        ruler.positionY = 20
        page.rulers.push(ruler)
    }
    
    deletePage(){
        this.templateInstanceStore.deletePageFromTemplate(this._page.value);
        this.clearSelect()
        this.elementSelector.clearSelect()
    }
}