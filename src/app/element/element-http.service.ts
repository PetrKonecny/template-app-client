import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {Observable}     from 'rxjs/Observable';
import {Element}     from './element';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/toPromise';
import { AppConfig } from '../app.config';

@Injectable()
//standard REST http service for element model
export class ElementHttpService {
    constructor(private http: Http, private config: AppConfig) { }
    
    private _elementsUrl = this.config.getConfig('api-url')+'/element';  // URL to web api

    getElements(): Observable<Element[]> {
        return this.http.get(this._elementsUrl, { withCredentials: true })
            .map(this.extractData)
            .catch(this.handleError);
    }
  
    getElement(id: number): Observable<Element> {
        return this.http.get(this._elementsUrl+"/"+id, { withCredentials: true })
            .map(this.extractData)
            .catch(this.handleError);
    }
    
    addElement(element: Element) {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers, withCredentials: true  });
        return this.http.post(this._elementsUrl, JSON.stringify(element,this.replacer), options)
                    .map(this.extractData)
                    .catch(this.handleError);
    }
    
    updateElement(element: Element) {
        
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers, withCredentials: true  });
        return this.http.put(this._elementsUrl+"/"+element.id, JSON.stringify(element,this.replacer), options)
                    .map(this.extractData)
                    .catch(this.handleError);
    }
    
    removeElement(id: number): Observable<Element> {
        return this.http.delete(this._elementsUrl+"/"+id, { withCredentials: true })
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