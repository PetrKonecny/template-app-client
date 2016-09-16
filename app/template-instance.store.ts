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


@Injectable()
export class TemplateInstanceStore {
    constructor(private templateInstanceService: TemplateInstanceService, private templateService: TemplateService) { }
    
    private _templateInstance: BehaviorSubject<TemplateInstance> = new BehaviorSubject(new TemplateInstance);
    public templateInstance: Observable<TemplateInstance> = this._templateInstance.asObservable();
    
    private _template: BehaviorSubject<Template> = new BehaviorSubject(new Template);
    public template: Observable<Template> = this._template.asObservable();
    
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
    
    saveTemplateInstance(){
        if(this._templateInstance.value.id > 0){
            this.templateInstanceService.updateTemplateInstance(this._templateInstance.value).subscribe();
        }else{
            this.templateInstanceService.addTemplateInstance(this._templateInstance.value).subscribe();
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
        if (element.type == 'text_element'){
            var content2 = new TextContent();
            this._templateInstance.value.contents.push(content2);
            return content2;
        }
        
        if (element.type == 'image_element'){
            var content3 = new ImageContent();
            this._templateInstance.value.contents.push(content3);
            return content3;
        }
    }
}