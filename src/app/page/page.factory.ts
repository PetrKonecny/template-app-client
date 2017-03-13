import {Page} from './page';
import {Injectable} from '@angular/core';

@Injectable()
export class PageFactory{

	width: number
	height: number

	setWidth(width: number){
		this.width = width
		return this
	}

	setHeight(width: number){
		this.width = width
		return this
	}

	build(){
		let page = new Page
		page.width = this.width
		page.height = this.height
		page.elements = []
		page.rulers = []
		return page
	}

}