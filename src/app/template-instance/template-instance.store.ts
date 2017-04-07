import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/Rx';
import {TemplateInstanceService} from './template-instance.service'
import {TemplateService} from '../template/template.service'
import {TemplateInstance} from './template-instance';
import {Template} from '../template/template';
import {Observable} from 'rxjs/Observable';
import {Element} from '../element/element'
import {TextContent} from '../content/text-content'
import {ImageContent} from '../content/image-content'
import {Content} from '../content/content'
import {Page} from '../page/page'
import {TableElement} from '../element/table-element'
import {TableContent, RowContent, CellContent} from '../content/table-content'
import {Guide} from '../guide/guide'
import {TemplateStore} from '../template/template.store'
/*
Stores template and template instance (document) that is currently being worked on.
provides methods that work with the saved template or template instance
This calss should be provided by root as the tmeplate and template instance is shared through 
different routes in some cases 
*/

@Injectable()
export class TemplateInstanceStore {
    //Constructor injects relevant http services automatically
    constructor(private templateInstanceService: TemplateInstanceService, private templateService: TemplateService, private templateStore: TemplateStore) { }
    
    /*Observable Behaviorubject contains TemplateInstance that is loaded in the store
    should not be manipulated outside of this class
    */ 
    private _templateInstance: BehaviorSubject<TemplateInstance> = new BehaviorSubject(new TemplateInstance);
    /*Observable reference to the template instance Subject
    subscribtion to this returns currently loaded TemplateInstance
    */
    public templateInstance: Observable<TemplateInstance> = this._templateInstance.asObservable();
    private cleanLocked: boolean = false;

    /*Loads template instance to the store with corresponding template
    the subscription to http services is canceled after geting first valid result (method First())
    */
    getTemplateInstanceWithTemplate(id: number){
        return this.templateInstanceService.getTemplateInstance(id)
        .map(res => {return {templateInstance: res}})
        .flatMap(res => this.templateService.getTemplate(res.templateInstance.template_id).map(template => {return {template: template, templateInstance: res.templateInstance}}))
        .first(res => {return res.template.id>0 && res.templateInstance.id>0})
        .map(res =>{
            this._templateInstance.next(res.templateInstance)
            this.templateStore.loadTemplate(res.template)
        })

    }
    
    getTemplateInstance(id: number){
        return this.templateInstanceService.getTemplateInstance(id).first().subscribe((res) => {
            this._templateInstance.next(res);
        });
    }
    
   
    saveTemplateInstance(){
        if(this._templateInstance.value.id > 0){
            return this.templateInstanceService.updateTemplateInstance(this._templateInstance.value).map(
                templateInstance => this._templateInstance.next(templateInstance)
            );
        }else{
            return this.templateInstanceService.addTemplateInstance(this._templateInstance.value).map(
                templateInstance => this._templateInstance.next(templateInstance)
            );
        }
    }
    
    cleanStore(){
        if (this.cleanLocked){
            this.cleanLocked = false;
        }else{
            this._templateInstance.next(new TemplateInstance);
        }
    }
    
    loadTemplateInstance(templateInstance: TemplateInstance){
        this._templateInstance.next(templateInstance)
    }
    
    ignoreNextClean(){
        this.cleanLocked = true;
    }
}