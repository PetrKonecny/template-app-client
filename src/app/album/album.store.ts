import {Injectable} from '@angular/core';
import {Album} from '../album/album'
import {BehaviorSubject, Observable} from 'rxjs/Rx'
import {AlbumHttpService} from '../album/album-http.service'
import {User} from '../user/user'

@Injectable()
//generic page store
export class AlbumStore {
    
   
	private _content: BehaviorSubject<AlbumStoreResponse> = new BehaviorSubject({error: null, loading: true, updatedAt: null, albums: null});
    public content: Observable<AlbumStoreResponse> = this._content.asObservable();    
    
    constructor(private service: AlbumHttpService){}

    getAlbums(user: User){
    	this._content.next(Object.assign({},this._content.value,{albums: null,loading: true}))
    	if(user.admin){
    		return this.service.getAlbums().first()
            .do(null,error => this._content.next(Object.assign({},this._content.value,{loading: false, error: error})))
            .map(
    			albums => {
    				this._content.next(Object.assign({},this._content.value,{error: null, loading: false, updatedAt: Date.now(), albums: albums }))
    				return albums
    			}
            )
    	}else{
    		return Observable.forkJoin(this.service.getAlbumsForUser(user.id),this.service.getPublicAlbums())
            .do(null,error => this._content.next(Object.assign({},this._content.value,{loading: false, error: error})))
            .map(
    			res => {
                let filtered = res[1].filter((album)=> {return !res[0].some(album2 => album.id == album2.id)})
                let albums2 = res[0].concat(filtered)
    			this._content.next(Object.assign({},this._content.value,{error: null, loading: false, updatedAt: Date.now(), albums: albums2}))
    			return albums2
    			}
			)
    	}
    }

    addAlbum(album: Album){
    	return this.service.addAlbum(album).first().do(
    		album => this._content.next(Object.assign({},this._content.value,{error: null, loading: false, updatedAt: Date.now(), albums: [].concat(this._content.value.albums).concat([album])})),
    		error => this._content.next(Object.assign({},this._content.value,{loading: false, error: error}))
    	)
    }

   	editAlbum(album: Album){
    	return this.service.updateAlbum(album).first().do(
    		album => this._content.next(Object.assign({},this._content.value,{error: null, loading: false, updatedAt: Date.now(), albums: [].concat(this._content.value.albums).filter(album2 => album2.id != album.id).concat([album])})),
    		error => this._content.next(Object.assign({},this._content.value,{loading: false, error: error}))
    	)
    }

    deleteAlbum(album: Album){
    	return this.service.removeAlbum(album.id).first().do(
    		res => this._content.next(Object.assign({},this._content.value,{error: null, loading: false, updatedAt: Date.now(), albums: [].concat(this._content.value.albums).filter(album2 => album2.id != album.id)})),
    		error => this._content.next(Object.assign({},this._content.value,{loading: false, error: error}))
		)
    }

}

export interface AlbumStoreResponse {
	error: any
	loading: boolean
	updatedAt: number
	albums: Album[]
}