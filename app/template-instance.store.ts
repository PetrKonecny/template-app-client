import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/Rx';
import {TemplateInstanceService} from './template-instance.service'
import {TemplateService} from './template.service'
import { TemplateInstance} from './template-instance';
import { Template} from './template';
import {Observable} from 'rxjs/Observable';
import {Element} from './element'
import {TextContent} from './text-content'
import {ImageContent} from './image-content'
import {Content} from './content'
import {Page} from './page'
import {TableElement} from './table-element'
import {TableContent, RowContent, CellContent} from './table-content'


@Injectable()
export class TemplateInstanceStore {
    constructor(private templateInstanceService: TemplateInstanceService, private templateService: TemplateService) { }
    
    private _templateInstance: BehaviorSubject<TemplateInstance> = new BehaviorSubject(new TemplateInstance);
    public templateInstance: Observable<TemplateInstance> = this._templateInstance.asObservable();
    
    private _template: BehaviorSubject<Template> = new BehaviorSubject(new Template);
    public template: Observable<Template> = this._template.asObservable();
    
    private cleanLocked: boolean = false;
    
    getTemplateInstance(id: number){
        this.templateInstanceService.getTemplateInstance(id).subscribe((res) => {
            this._templateInstance.next(res);
            this.getTemplate(res.template_id);
        });
    }
    
    getTemplate(id: number){
        this.templateService.getTemplate(id).subscribe(data => { 
            this._template.next(data);
            this._templateInstance.value.template_id = data.id;
        });
    }
    
    saveTemplate(){
        if(this._template.value.id > 0){
            this.templateService.updateTemplate(this._template.value).subscribe(
                template => this._template.next(template)
            );
        }else{
            this.templateService.addTemplate(this._template.value).subscribe(
                template => this._template.next(template)
            );
        }
    }
    
    saveTemplateInstance(){
        if(this._templateInstance.value.id > 0){
            this.templateInstanceService.updateTemplateInstance(this._templateInstance.value).subscribe(
                templateInstance => this._templateInstance.next(templateInstance)
            );
        }else{
            this.templateInstanceService.addTemplateInstance(this._templateInstance.value).subscribe(
                templateInstance => this._templateInstance.next(templateInstance)
            );
        }
    }
    
    copyContentsFromTemplate(){
        if(!this._template.value.pages) {
            return
        }
        if(this._templateInstance.value.contents == null){
            this._templateInstance.value.contents = new Array<Content>();
        }
        
        for (var page of this._template.value.pages){
            for (var element of page.elements){
                if(element.content){
                    element.content.id = null;
                    this._templateInstance.value.contents.push(element.content);
                }
            }
        }
    }
    
    getContentsFromTemplateInstance(){
        if(this._template.value.pages == null) {
            return
        }
        for (var page of this._template.value.pages){
            for (var element of page.elements){
                element.content = this.getContentForElement(element);
            }
        }        
    }
    
    createContentsForTemplate(){
        if(this._template.value.pages == null){
            return
        }
        
        for (var page of this._template.value.pages){
            for (var element of page.elements){
                if(element.content == null){
                    //this.createNewContentForElement(element);
                } 
            }
        }
        
    }
    
    getContentForElement(element: Element){
        if (this._templateInstance.value.contents == null){
            this._templateInstance.value.contents = new Array<Content>();
        }
        
        for (var content of this._templateInstance.value.contents){
            if(content.element_id === element.id){
                return content;
            }        
        }
        this._templateInstance.value.contents.push(this.createNewContentForElement(element));
    }
    
    createNewContentForElement(element: Element){
        var content;
        if (element.type == 'text_element'){
            content = new TextContent();           
        }       
        if (element.type == 'image_element'){
            content = new ImageContent();
        }
        if (element.type == 'table_element'){
            var tableContent = new TableContent()
            var tableElement = <TableElement>element
            tableElement.rows.forEach(
                (row) => {
                    var rowContent = new RowContent()
                    tableElement.cells.forEach((cell) => rowContent.cells.push(new CellContent()))
                    tableContent.rows.push(new RowContent)
                }
            )
        }
        element.content = content;
        return content;
    }
    
    deleteElementFromTemplate(element: Element){
        this._template.value.pages.forEach((page) => {
            var index = page.elements.indexOf(element)
            if(index > -1){
                page.elements.splice(index,1)
            }
        })
    }
    
    deletePageFromTemplate(page: Page){
        var index = this._template.value.pages.indexOf(page)
        if(index > -1){
            this._template.value.pages.splice(index,1)
        }
    }
    
    cleanStore(){
        if (this.cleanLocked){
            this.cleanLocked = false;
        }else{
            this._template.next(new Template);
            this._templateInstance.next(new TemplateInstance);
        }
    }
    
    ignoreNextClean(){
        this.cleanLocked = true;
    }
    
    
}