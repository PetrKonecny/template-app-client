import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Rx';
import {Observable} from 'rxjs/Observable';
import {Image} from './image'
import {ImageContent} from '../content/image-content'

@Injectable()
export class ImageSelector {
    
    
    /*
    private _imageContent: BehaviorSubject<ImageContent> = new BehaviorSubject(new ImageContent);
    public imageContent: Observable<ImageContent> = this._imageContent.asObservable();
    */
    private _selectorWindowOpened: Subject<boolean> = new Subject<boolean>();
    public selectorWindowOpened: Observable<boolean> = this._selectorWindowOpened.asObservable();
    
    private _image: Subject<Image> = new Subject<Image>();
    public image: Observable<Image> = this._image.asObservable();
    
    public imageContent:ImageContent
    /*
    selectImage(id: number){
        var imageContent = <ImageContent> this.selectedComponent.element.content;
        imageContent.image_id = id;
        this._imageContent.next(imageContent);
    }*/
    
    openSelectorWindow(){
        this._selectorWindowOpened.next(true);
    }
    
    changeImage(image: Image){
        this._image.next(image)
    }
        
    closeSelectorWindow(){
        this._selectorWindowOpened.next(false);
    }
    
    
}