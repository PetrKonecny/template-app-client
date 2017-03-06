import { Injectable } from '@angular/core';
import {AppComponent} from './app.component'
import {Subject, Observable} from 'rxjs/Rx'

@Injectable()
export class AppComponentRef {

    component: AppComponent

    private _mouseMove: Subject<any> = new Subject();
    public mouseMove: Observable<any> = this._mouseMove.asObservable();  


    nextMouseMove(move){
    	this._mouseMove.next(move)
    }
    

}