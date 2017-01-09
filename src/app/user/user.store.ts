import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/Rx';
import {User} from './user'
import {Observable} from 'rxjs/Observable';
import {UserService} from './user.service'

@Injectable()
export class UserStore {

	private _user: BehaviorSubject<User> = new BehaviorSubject(new User);
    public user: Observable<User> = this._user.asObservable();

    constructor(private userService: UserService){
    }

    authUser(user: User){
		this.userService.loginUser(user).subscribe(user => this._user.next(user), error=> window.alert('wrong login or password'))
    }

    loggedIn(){
    	return this._user.value && this._user.value.token && this._user.value.token.length > 0
    }
}