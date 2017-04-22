import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/Rx';
import {TemplateService} from '../template/template.service'
import {Template} from '../template/template';
import {Observable} from 'rxjs/Observable';
import {TemplateHelper} from '../template/template.helper'
/*
Stores template and template instance (document) that is currently being worked on.
provides methods that work with the saved template or template instance
This calss should be provided by root as the tmeplate and template instance is shared through 
different routes in some cases 
*/

@Injectable()
export class TemplateStore {
    //Constructor injects relevant http services automatically
    constructor(private templateService: TemplateService) { }
     
    
    private _template: BehaviorSubject<Template> = new BehaviorSubject(new Template);
    public template: Observable<Template> = this._template.asObservable();
    
    private cleanLocked: boolean = false;

    
    getTemplate(id: number){
        return this.templateService.getTemplate(id).map(
            data => { 
                this._template.next(data);
            }
        )
    }
    /* Sends stored template to the update/add http service depending on it's id
    (instances saved in the backend have IDs while those just created in the app
    and not yet saved in backend don't)
    */
    saveTemplate(){
        if(this._template.value.id > 0){
            return this.templateService.updateTemplate(this._template.value)
        }else{
            return this.templateService.addTemplate(this._template.value).map(template => TemplateHelper.copyIds(this._template.value,template))
        }
    }
    
    /* Sends stored template instance to the update/add http service depending on it's id
    (instances saved in the backend have IDs while those just created in the app
     and not yet saved in backend don't)
    */
    cleanStore(){
        if (this.cleanLocked){
            this.cleanLocked = false;
        }else{
            this._template.next(new Template);
        }
    }
    
    loadTemplate(template: Template){
        this._template.next(template)
    }
    
    ignoreNextClean(){
        this.cleanLocked = true;
    }
      

}