import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {Observable}     from 'rxjs/Observable';
import {Template}     from './template';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class TemplateService {
    constructor(private http: Http) { }

    private _templatesUrl = 'http://localhost:8080/template';  // URL to web api

    getTemplates(): Observable<Template[]> {
        return this.http.get(this._templatesUrl)
            .map(this.extractData)
            .catch(this.handleError);
    }
    
    getTemplate(id: number): Observable<Template> {
        return this.http.get(this._templatesUrl+"/"+id)
            .map(this.extractData)
            .catch(this.handleError);
    }
    
    addTemplate(template: Template) {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this._templatesUrl, JSON.stringify(template), options)
                    .map(this.extractData)
                    .catch(this.handleError);
    }
    
    updateTemplate(template: Template) {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.put(this._templatesUrl+"/"+template.id, JSON.stringify(template), options)
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