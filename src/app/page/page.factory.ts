import {Page} from './page';
import {Injectable} from '@angular/core';

@Injectable()
export class PageFactory{

	width: number = Page.defaultWidth
	height: number = Page.defaultHeight

	setWidth(width: number){
		this.width = width
		return this
	}

	setHeight(height: number){
		this.height = height
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