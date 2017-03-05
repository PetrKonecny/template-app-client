import {Injectable} from '@angular/core';
import { Image} from '../image/image';
import { Element } from '../element/element';
import { ElementSelector} from '../element/element-selector';
import {Page} from './page'
import {TextContent} from '../content/text-content'
import {ImageContent} from '../content/image-content'
import {TableContent} from '../content/table-content'
import {ImageElement} from '../element/image-element'
import {TextElement} from '../element/text-element'
import {TableElement} from '../element/table-element'
import {TemplateInstanceStore} from '../template-instance/template-instance.store'
import {Guide} from '../guide/guide'
import {FrameElement} from '../element/frame-element'
import {ImageSelector} from '../image/image-selector'
import {BehaviorSubject, Observable} from 'rxjs/Rx'
import {PageCommands} from './page'

@Injectable()
export class PageSelector {
    
  
	private _page: BehaviorSubject<Page> = new BehaviorSubject(null);
    public page: Observable<Page> = this._page.asObservable();    

    constructor(private commands: PageCommands,  private templateInstanceStore: TemplateInstanceStore, private elementSelector: ElementSelector){}
    
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
        this.commands.addElement(this._page.value, element)
       
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
        let content = new ImageContent();
        content.left = 0;
        content.top = 0;
        element.content = content
        this.commands.addElement(this._page.value, element)
   
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
        this.commands.addElement(this._page.value, element)
    }
    
    createNewTableElement(width: number, height: number, columnWidth: number, rowHeight: number){
    	let page = this._page.value
        if (page.elements == null) {
            page.elements = new Array<Element>();
        }
        var element = new TableElement();
        element.positionX = 0
        element.positionY = 0
        console.log(width,height)
        TableElement.addRows(element, height, width, rowHeight, columnWidth, 0)
        this.commands.addElement(this._page.value, element)
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