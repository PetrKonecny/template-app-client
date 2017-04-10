import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/Rx';
import {User} from './user'
import {Observable} from 'rxjs/Observable';
import {UserService} from './user.service'

@Injectable()
export class UserStore {

	private _user: BehaviorSubject<User> = new BehaviorSubject(new User);
    public user: Observable<User> = this._user.asObservable();

    constructor(private service: UserService){}

    loadUser(user: User){
        this._user.next(user)
    }

    auth(){
    	return this.service.getCurrentUser().map(user => {
            this._user.next(user)
        })
    }

    isLoggedIn(){
        return this._user.value.id > 0
    }

    
}