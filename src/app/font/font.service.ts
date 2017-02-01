import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {Observable}     from 'rxjs/Observable';
import {Font}     from './font';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/toPromise';
import { AppConfig } from '../app.config';

@Injectable()
export class FontService {
    constructor(private http: Http,  private config: AppConfig) { }

    private _fontsUrl =  this.config.getConfig('api-url')+'/font';  // URL to web api

    getFonts(): Observable<Font[]> {
        return this.http.get(this._fontsUrl)
            .map(this.extractData)
            .catch(this.handleError);
    }
    
    getFont(id: number): Observable<Font> {
        return this.http.get(this._fontsUrl+"/"+id)
            .map(this.extractData)
            .catch(this.handleError);
    }
    
    addFont(font: Font) {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this._fontsUrl, JSON.stringify(font), options)
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