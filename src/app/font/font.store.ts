import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/Rx';
import {Observable} from 'rxjs/Observable';
import {FontService} from './font.service'
import {Font} from './font'

@Injectable()
export class FontStore {

    fontNames=['Arial','Helvetica','Times New Roman','Georgia','Verdana']

	private _fonts: BehaviorSubject<Font[]> = new BehaviorSubject(new Array<Font>());
    public fonts: Observable<Font[]> = this._fonts.asObservable();


    constructor(private fontService: FontService){
        this.fontService.getFonts().subscribe(fonts =>  this._fonts.next(fonts))
    }  

    getDefaultFonts(){
        let fonts = new Array<Font>()
        this.fontNames.forEach(name => {
            let font = new Font()
            font.name = name
            fonts.push(font)
        })
        return fonts
    }
}