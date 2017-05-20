import {Injectable} from '@angular/core';
import {Page} from './page'
import {BehaviorSubject, Observable} from 'rxjs/Rx'


@Injectable()
//generic page store
export class PageStore {
    
   
	private _page: BehaviorSubject<Page> = new BehaviorSubject(null);
    public page: Observable<Page> = this._page.asObservable();    
    
    selectPage(page: Page){
        this._page.next(page)
    }
}