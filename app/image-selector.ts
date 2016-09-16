import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/Rx';
import {TemplateInstanceService} from './template-instance.service'
import {TemplateService} from './template.service'
import { TemplateInstance} from './template-instance';
import { Template} from './template';
import {Observable} from 'rxjs/Observable';
import {Element} from './element'
import {Image} from './image'
import {Content} from './content'
import {ImageContent} from './image-content'
import {DisplayElementComponent} from './display-element.component'


@Injectable()
export class ImageSelector {
    
    private selectedComponent: DisplayElementComponent
    
    /*
    private _imageContent: BehaviorSubject<ImageContent> = new BehaviorSubject(new ImageContent);
    public imageContent: Observable<ImageContent> = this._imageContent.asObservable();
    */
    private _selectorWindowOpened: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public selectorWindowOpened: Observable<boolean> = this._selectorWindowOpened.asObservable();
    
    /*
    selectImage(id: number){
        var imageContent = <ImageContent> this.selectedComponent.element.content;
        imageContent.image_id = id;
        this._imageContent.next(imageContent);
    }*/
    
    openSelectorWindow(component: DisplayElementComponent){
        this.selectedComponent = component;
        this._selectorWindowOpened.next(true);
    }
    
    sendImageToComponent(image: Image){
        this.selectedComponent.refreshImage(image);
    }
        
    closeSelectorWindow(){
        this._selectorWindowOpened.next(false);
    }
    
    
}