import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {Observable}     from 'rxjs/Observable';
import {Image}     from './image';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/toPromise';
import { AppConfig } from '../app.config';

@Injectable()
export class ImageService {
    constructor(private http: Http,  private config: AppConfig) { }

    private _imagesUrl =  this.config.getConfig('api-url')+'/image';  // URL to web api

    getImages(): Observable<Image[]> {
        return this.http.get(this._imagesUrl)
            .map(this.extractData)
            .catch(this.handleError);
    }
    
    getImage(id: number): Observable<Image> {
        return this.http.get(this._imagesUrl+"/"+id)
            .map(this.extractData)
            .catch(this.handleError);
    }
    
    addImage(image: Image) {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this._imagesUrl, JSON.stringify(image), options)
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