import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {Observable}     from 'rxjs/Observable';
import {User} from './user'
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/toPromise';
import {BehaviorSubject} from 'rxjs/Rx';

@Injectable()
export class UserService {
    constructor(private http: Http) { }

    private _user: BehaviorSubject<User> = new BehaviorSubject(null)
    public user: Observable<User> = this._user.asObservable();

    loginUser(user: any): Observable<User> {
    	if(user.email == "user1@mail.com" && user.password == "user1"){
			this._user.next({id:null,token:"afafafafafafa"})
    	}else if(user.email == "user2@mail.com" && user.password == "user2"){
			this._user.next({id:null,token:"fafafafafafaf"})
    	}else{
    		return Observable.throw('Server error')
    	}
        return this.user
    }    

    logoutUser(){
    	this._user.next(null)
    }
    
    private extractData(res: Response) {
        if (res.status < 200 || res.status >= 300) {
            throw new Error('Bad response status: ' + res.status);
        }
        let body = res.json();
        return body || {};
    }
    private handleError(error: any) {
        // In a real world app, we might send the error to remote logging infrastructure
        let errMsg = error.message || 'Server error';
        console.error(error);
        console.error(errMsg); // log to console instead
        return Observable.throw(errMsg);
    }
}