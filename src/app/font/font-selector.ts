import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/Rx';
import {Font} from './font'
import {Subject} from 'rxjs/Rx';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class FontSelector {
    
    private _selectorWindowOpened: Subject<boolean> = new Subject<boolean>();
    public selectorWindowOpened: Observable<boolean> = this._selectorWindowOpened.asObservable();
    
    private _font: Subject<Font> = new Subject<Font>();
    public font: Observable<Font> = this._font.asObservable();

    private _fontSize: Subject<number> = new Subject<number>();
    public fontSize: Observable<number> = this._fontSize.asObservable();

    selectFont(font: Font){
    	if(!font){return}
		this._font.next(font)
    }

    changeFontSize(size: number){
        if(!size){return}
        this._fontSize.next(size)
    }

    openSelectorWindow(){
        this._selectorWindowOpened.next(true);
    }
    
        
    closeSelectorWindow(){
        this._selectorWindowOpened.next(false);
    }
    
    
}