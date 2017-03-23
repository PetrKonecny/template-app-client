import {ImageElement} from '../element/image-element'
import {TextElement} from '../element/text-element'
import {TableElement} from '../element/table-element'
import {FrameElement} from '../element/frame-element'
import {TextContent} from '../content/text-content'
import {ImageContent} from '../content/image-content'
import {TableContent} from '../content/table-content'
import {Image} from '../image/image'
export class ElementFactory{

	positionX: number = 0
	positionY: number = 0
	width: number = 100
	height: number = 100

	setPositionX(x: number){
		this.positionX = x
		return this 
	}

	setPositionY(y: number){
		this.positionY = y
		return this 
	}

	setWidth(width: number){
		this.width = width
		return this
	}

	setHeight(height: number){
		this.height = height 
		return this
	}
}

export class TextElementFactory extends ElementFactory{

	build(){
		let element = new TextElement()
		element.width = this.width
		element.height = this.height
		element.positionX = this.positionX
		element.positionY = this.positionY

	    let content = new TextContent()
        content.text = "<p></p>"
        element.content = content
		
		return element
	}

}

export class ImageElementFactory extends ElementFactory{

	image: Image

	build(){
		let element = new ImageElement()
		element.width = this.width
		element.height = this.height
		element.positionX = this.positionX
		element.positionY = this.positionY
		element.image = this.image
		return element
	}

	setImage(image: Image){
		this.image = image
	}

}

export class FrameElementFactory extends ElementFactory{

	build(){
		let element = new FrameElement()
		element.width = this.width
		element.height = this.height
		element.positionX = this.positionX
		element.positionY = this.positionY

		let content = new ImageContent();
        content.left = 0;
        content.top = 0;
        element.content = content

		return element
	}

}

export class TableElementFactory extends ElementFactory{

	columnCount: number = 5
	rowCount: number = 5
	rowHeight: number = 30
	columnWidth: number = 1000

	setColumnCount(count: number){
		this.columnCount = count 
		return this 
	}

	setRowCount(count: number){
		this.rowCount = count
		return this 
	}

	setColumnWidth(width: number){
		this.columnWidth = width
		return this
	}

	setRowHeight(height: number){
		this.rowHeight = height 
		return this
	}

	build(){
		let element = new TableElement()		
		element.positionX = this.positionX
		element.positionY = this.positionY
        TableElement.addRows(element, this.rowCount, this.columnCount, this.rowHeight, this.columnWidth, 0)
		return element
	}

}