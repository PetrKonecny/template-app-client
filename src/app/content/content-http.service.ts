import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {Observable}     from 'rxjs/Observable';
import {Content}     from './content';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/toPromise';
import { AppConfig } from '../app.config';

@Injectable()
export class ContentHttpService {
    constructor(private http: Http, private config: AppConfig) { }
    
    private _contentsUrl = this.config.getConfig('api-url')+'/content';  // URL to web api

    getContents(): Observable<Content[]> {
        return this.http.get(this._contentsUrl, { withCredentials: true })
            .map(this.extractData)
            .catch(this.handleError);
    }
  
    getContent(id: number): Observable<Content> {
        return this.http.get(this._contentsUrl+"/"+id, { withCredentials: true })
            .map(this.extractData)
            .catch(this.handleError);
    }
    
    addContent(content: Content) {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers, withCredentials: true  });
        return this.http.post(this._contentsUrl, JSON.stringify(content,this.replacer), options)
                    .map(this.extractData)
                    .catch(this.handleError);
    }
    
    updateContent(content: Content) {
        
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers, withCredentials: true  });
        return this.http.put(this._contentsUrl+"/"+content.id, JSON.stringify(content,this.replacer), options)
                    .map(this.extractData)
                    .catch(this.handleError);
    }
    
    removeContent(id: number): Observable<Content> {
        return this.http.delete(this._contentsUrl+"/"+id, { withCredentials: true })
            .map(this.extractData)
            .catch(this.handleError);
    }

    private extractData(res: Response) {
        if (res.status < 200 || res.status >= 300) {
            throw new Error('Bad response status: ' + res.status);
        }
        let body;
        if (res.text()) {
            body = res.json();
        }
        return body || {};
    }
    
    private handleError(error: any) {
        // In a real world app, we might send the error to remote logging infrastructure
        let errMsg = error.message || 'Server error';
        console.error(error);
        console.error(errMsg); // log to console instead
        return Observable.throw(errMsg);
    }
    
    replacer(key,value) {
        if (key=="editor") return undefined;
        else return value;
    }
}