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

export interface ImageRefreshable {
    refreshImage(image:Image);
} 


@Injectable()
export class ImageSelector {
    
    
    /*
    private _imageContent: BehaviorSubject<ImageContent> = new BehaviorSubject(new ImageContent);
    public imageContent: Observable<ImageContent> = this._imageContent.asObservable();
    */
    private _selectorWindowOpened: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public selectorWindowOpened: Observable<boolean> = this._selectorWindowOpened.asObservable();
    
    public imageContent:ImageContent
    /*
    selectImage(id: number){
        var imageContent = <ImageContent> this.selectedComponent.element.content;
        imageContent.image_id = id;
        this._imageContent.next(imageContent);
    }*/
    
    openSelectorWindow(content: ImageContent){
        this.imageContent = content
        this._selectorWindowOpened.next(true);
    }
    
    changeImage(image: Image){
        this.imageContent.image = image
    }
        
    closeSelectorWindow(){
        this._selectorWindowOpened.next(false);
    }
    
    
}