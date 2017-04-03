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
import { AppConfig } from '../app.config';
import {Template} from '../template/template'
import {TemplateInstance} from '../template-instance/template-instance'

@Injectable()
export class UserService {

    constructor(private http: Http, private config: AppConfig) { }

    private _usersUrl = this.config.getConfig('api-url')+'/user';  // URL to web api

    getUser(): Observable<User> {
        return this.http.get(this._usersUrl+'/current', { withCredentials: true })
            .map(this.extractData)
            .catch(this.handleError);
    }    

    getUsers(): Observable<User[]> {
        return this.http.get(this._usersUrl, { withCredentials: true })
            .map(this.extractData)
            .catch(this.handleError);
    }

    logoutUser(){
    	return this.http.get(this.config.getConfig('api-url')+'/logout', { withCredentials: true })
            .catch(this.handleError);
    }

    getUserTemplates(userId: number): Observable<Template[]> {
        return this.http.get(this._usersUrl+'/'+userId+'/templates', { withCredentials: true })
            .map(this.extractData)
            .catch(this.handleError);
    }

    getUserTemplateInstances(userId: number): Observable<TemplateInstance[]> {
        return this.http.get(this._usersUrl+'/'+userId+'/template-instances', { withCredentials: true })
            .map(this.extractData)
            .catch(this.handleError);
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