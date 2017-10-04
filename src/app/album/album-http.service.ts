import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {Observable}     from 'rxjs/Observable';
import {Album}     from './album';
import {Image} from '../image/image'
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/toPromise';
import { AppConfig } from '../app.config';

@Injectable()
export class AlbumHttpService {
    constructor(private http: Http,  private config: AppConfig) { }

    private _albumsUrl =  this.config.getConfig('api-url')+'/album';  // URL to web api

    getAlbums(): Observable<Album[]> {
        return this.http.get(this._albumsUrl, { withCredentials: true })
            .map(this.extractData)
            .catch(this.handleError);
    }

    getPublicAlbums(): Observable<Album[]> {
        return this.http.get(this._albumsUrl+'/public',{ withCredentials: true })
            .map(this.extractData)
            .catch(this.handleError);
    }

    getAlbumsForUser(id: number): Observable<Album[]> {
        return this.http.get(this._albumsUrl+'/user/'+id,{ withCredentials: true })
            .map(this.extractData)
            .catch(this.handleError);
    }
    
    getAlbum(id: number): Observable<Album> {
        return this.http.get(this._albumsUrl+"/"+id,{ withCredentials: true })
            .map(this.extractData)
            .catch(this.handleError);
    }

    getDemoAlbum(): Observable<Album> {
        return this.http.get(this._albumsUrl+"/demo")
            .map(this.extractData)
            .catch(this.handleError);
    }

    moveImages(images: Image[], album: Album){
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers ,  withCredentials: true});
        return this.http.post(this._albumsUrl+"/"+album.id+"/move",JSON.stringify(images),options)
        .catch(this.handleError);
    }

    addAlbum(album: Album) {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers , withCredentials: true});
        return this.http.post(this._albumsUrl, JSON.stringify(album), options)
                    .map(this.extractData)
    }

   updateAlbum(album: Album) {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers , withCredentials: true});
        return this.http.put(this._albumsUrl+'/'+album.id, JSON.stringify(album), options)
                    .map(this.extractData)
    }

    removeAlbum(id: number): Observable<Album> {
        return this.http.delete(this._albumsUrl+"/"+id, { withCredentials: true })
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