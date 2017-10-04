import {Injectable} from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs/Rx';
import {User} from './user'
import {Observable} from 'rxjs/Observable';
import {UserService} from './user.service'

@Injectable()
export class UserStore {

	private _user: BehaviorSubject<User> = new BehaviorSubject(null);
    public user: Observable<User> = this._user.asObservable();

    constructor(private service: UserService){}

    loadUser(user: User){
        this._user.next(user)
    }

    auth(){
    	return this.service.getCurrentUser().first().do(user => {
            this._user.next(user)
        })
    }

    isLoggedIn(){
        return this._user.value && this._user.value.id > 0
    }
    
}