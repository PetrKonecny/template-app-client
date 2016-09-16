import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/Rx';
import {TemplateInstance} from './template-instance';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class TemplateInstanceService {
    constructor(private http: Http) { }

    private templateInstancesUrl = 'http://localhost:8080/templateInstance';  // URL to web api
 
    getTemplateInstances(): Observable<TemplateInstance[]> {
        return this.http.get(this.templateInstancesUrl)
            .map(this.extractData)
            .catch(this.handleError);
    }
    
    getTemplateInstance(id: number): Observable<TemplateInstance> {
        return this.http.get(this.templateInstancesUrl+"/"+id)
            .map(this.extractData)
            .catch(this.handleError);
    }
    
    addTemplateInstance(templateInstance: TemplateInstance) {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.templateInstancesUrl, JSON.stringify(templateInstance), options)
                    .map(this.extractData)
                    .catch(this.handleError);
    }
    
    updateTemplateInstance(templateInstance: TemplateInstance) {
        console.log(templateInstance);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.put(this.templateInstancesUrl+"/"+templateInstance.id, JSON.stringify(templateInstance), options)
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