import { Injectable } from '@angular/core';
import {AppComponent} from './app.component'
import {Subject, Observable} from 'rxjs/Rx'

@Injectable()
/** Reference to the root component
is used to register mouse movement and shift press
for better performance
*/
export class AppComponentRef {

    component: AppComponent

    private _mouseMove: Subject<any> = new Subject();
    public mouseMove: Observable<any> = this._mouseMove.asObservable();  

    private _shiftPress: Subject<boolean> = new Subject();
    public shiftPRess: Observable<boolean> = this._shiftPress.asObservable();  

    private _ctrlPress: Subject<boolean> = new Subject();
    public ctrilPRess: Observable<boolean> = this._ctrlPress.asObservable();

    nextMouseMove(move){
    	this._mouseMove.next(move)
    }

    nextShiftPress(press: boolean){
    	this._shiftPress.next(press)
    }

    nextCtrlPress(press: boolean){
        this._ctrlPress.next(press)
    }
    

}