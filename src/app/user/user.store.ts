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
        this.userService.getUser().subscribe(user => this._user.next(user))
    }  

    logoutUser(){
        this._user.next(null)
        this.userService.logoutUser()
    }
    
}