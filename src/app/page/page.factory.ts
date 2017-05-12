import {Page} from './page';
import {Injectable} from '@angular/core';

@Injectable()
export class PageFactory{

	width: number = Page.defaultWidth
	height: number = Page.defaultHeight
	margin: number = 0

	setWidth(width: number){
		this.width = width
		return this
	}

	setHeight(height: number){
		this.height = height
		return this
	}

	setMargin(margin: number){
		this.margin = margin
		return this
	}

	build(){
		let page = new Page
		page.width = this.width
		page.height = this.height
		page.margin = this.margin
		page.elements = []
		page.rulers = []
		return page
	}

}