import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/Rx';
import {Observable} from 'rxjs/Observable';
import {Font} from './font'

@Injectable()
export class FontSelector {
    
    private _selectorWindowOpened: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public selectorWindowOpened: Observable<boolean> = this._selectorWindowOpened.asObservable();
    
    
    openSelectorWindow(){
        this._selectorWindowOpened.next(true);
    }
    
        
    closeSelectorWindow(){
        this._selectorWindowOpened.next(false);
    }
    
    
}