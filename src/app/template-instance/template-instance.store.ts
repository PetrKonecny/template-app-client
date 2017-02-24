import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/Rx';
import {TemplateInstanceService} from './template-instance.service'
import {TemplateService} from '../template/template.service'
import { TemplateInstance} from './template-instance';
import { Template} from '../template/template';
import {Observable} from 'rxjs/Observable';
import {Element} from '../element/element'
import {TextContent} from '../content/text-content'
import {ImageContent} from '../content/image-content'
import {Content} from '../content/content'
import {Page} from '../page/page'
import {TableElement} from '../element/table-element'
import {TableContent, RowContent, CellContent} from '../content/table-content'
import {Guide} from '../guide/guide'
/*
Stores template and template instance (document) that is currently being worked on.
provides methods that work with the saved template or template instance
This calss should be provided by root as the tmeplate and template instance is shared through 
different routes in some cases 
*/

@Injectable()
export class TemplateInstanceStore {
    //Constructor injects relevant http services automatically
    constructor(private templateInstanceService: TemplateInstanceService, private templateService: TemplateService) { }
    
    /*Observable Behaviorubject contains TemplateInstance that is loaded in the store
    should not be manipulated outside of this class
    */ 
    private _templateInstance: BehaviorSubject<TemplateInstance> = new BehaviorSubject(new TemplateInstance);
    /*Observable reference to the template instance Subject
    subscribtion to this returns currently loaded TemplateInstance
    */
    public templateInstance: Observable<TemplateInstance> = this._templateInstance.asObservable();
    
    private _template: BehaviorSubject<Template> = new BehaviorSubject(new Template);
    public template: Observable<Template> = this._template.asObservable();
    
    private cleanLocked: boolean = false;

    /*Loads template instance to the store with corresponding template
    the subscription to http services is canceled after geting first valid result (method First())
    */
    getTemplateInstanceWithTemplate(id: number){
        this.templateInstanceService.getTemplateInstance(id)
        .map(res => {return {templateInstance: res}})
        .flatMap(res => this.templateService.getTemplate(res.templateInstance.template_id).map(template => {return {template: template, templateInstance: res.templateInstance}}))
        .first(res => {return res.template.id>0 && res.templateInstance.id>0})
        .subscribe(res =>{
            this._templateInstance.next(res.templateInstance)
            this._template.next(res.template)
            this._templateInstance.value.template_id = res.template.id;
        })

    }
    
    getTemplateInstance(id: number){
        this.templateInstanceService.getTemplateInstance(id).first().subscribe((res) => {
            this._templateInstance.next(res);
            this.getTemplate(res.template_id);
        });
    }
    
    getTemplate(id: number){
        this.templateService.getTemplate(id).first().subscribe(data => { 
            this._template.next(data);
            this._templateInstance.value.template_id = data.id;
        });
    }
    
    /* Sends stored template to the update/add http service depending on it's id
    (instances saved in the backend have IDs while those just created in the app
    and not yet saved in backend don't)
    */
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
    
    /* Sends stored template instance to the update/add http service depending on it's id
    (instances saved in the backend have IDs while those just created in the app
     and not yet saved in backend don't)
    */
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
    
    /* Adds elements from the stored template to the TemplateInstance
    */
    copyContentsFromTemplate(){
        if(!this._template.value.pages) {
            return
        }
        if(this._templateInstance.value.contents == null){
            this._templateInstance.value.contents = new Array<Content>();
        }
        
        for (var page of this._template.value.pages){
            for (var element of page.elements){
                if (this._templateInstance.value.contents.find(content=>(content && content.element_id == element.id)) == null && element.content){
                    if (element.content.type == 'table_content'){
                        TableContent.fillEmptyCells(<TableContent>element.content)
                    }
                    element.content.id = null;
                    this._templateInstance.value.contents.push(element.content);
                }
            }
        }
    }
    
    /* Adds corresponding content from stored Template Instance to each element of stored Template 
       Validates if the stored template has any pages
    */
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
            if(content && content.element_id === element.id){
                if (content.type == 'table_content'){
                    TableContent.fillEmptyCells(<TableContent>content)
                }
                return content;
            }        
        }
        this._templateInstance.value.contents.push(this.createNewContentForElement(element));
    }

    /*

    */
    filloutNewTemplate(){    
        if(this._template.value && this._template.value.pages && this._template.value.pages.length){
            return 
        } 
        this._template.value.pages = new Array<Page>()
        this._template.value.pages.push(new Page)      
    }
    
    createNewContentForElement(element: Element){
        var content;
        if (element.type == 'text_element'){
            content = new TextContent();           
        }       
        if (element.type == 'image_element'){
            content = null
        }
        if (element.type == 'frame_element'){
            content = new ImageContent()
        }
        if (element.type == 'table_element'){
            var tableContent = new TableContent()
            var tableElement = <TableElement>element
            tableElement.rows.forEach(
                (row) => {
                    var rowContent = new RowContent()
                    row.cells.forEach(() => rowContent.cells.push(new CellContent()))
                    tableContent.rows.push(new RowContent)
                }
            )
            content = tableContent
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
    
    deleteRulerFromTemplate(ruler: Guide){
        this._template.value.pages.forEach((page) => {
            var index = page.rulers.indexOf(ruler)
            if(index > -1){
                page.rulers.splice(index,1)
            }
        })
    }
    
    getPageForElement(element: Element){
        for (var page of this._template.value.pages){
            for (var elmnt of page.elements){
                if(element == element) {
                    return page
                }
            }
        }
    }
    
    deletePageFromTemplate(page: Page){
        var index = this._template.value.pages.indexOf(page)
        if(index > -1){
            this._template.value.pages.splice(index,1)
        }
    }
    
    cleanStore(){
        console.log('cleaning')
        if (this.cleanLocked){
            this.cleanLocked = false;
        }else{
            this._template.next(new Template);
            this._templateInstance.next(new TemplateInstance);
        }
    }
    
    loadTemplate(template: Template){
        this._template.next(template)
    }
    
    ignoreNextClean(){
        this.cleanLocked = true;
    }
    
    removeIdFromTemplate(){
        delete this._template.value.id
        this._template.value.pages.forEach(page=>{
            delete page.id
            page.elements.forEach(element => delete element.id)
        })
    }
    
    
}