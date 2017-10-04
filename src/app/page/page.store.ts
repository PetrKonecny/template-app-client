import {Injectable} from '@angular/core';
import {Page} from './page'
import {BehaviorSubject, Subject, Observable} from 'rxjs/Rx'


@Injectable()
//generic page store
export class PageStore {
    
   
	private _page: BehaviorSubject<Page> = new BehaviorSubject(null);
    public page: Observable<Page> = this._page.asObservable();    
    
    selectPage(page: Page){
        this._page.next(page)
    }

    echo(){
    	this._page.next(this._page.value)
    }
}